package com.elearny.service;

import com.elearny.dto.ApplicationReviewRequest;
import com.elearny.dto.InstructorApplicationResponse;
import com.elearny.entity.InstructorApplication;
import com.elearny.entity.Role;
import com.elearny.entity.RoleEnum;
import com.elearny.entity.User;
import com.elearny.repository.InstructorApplicationRepository;
import com.elearny.repository.RoleRepository;
import com.elearny.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminInstructorService {

    private final InstructorApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final InstructorService instructorService;

    public List<InstructorApplicationResponse> getApplications(String status) {
        List<InstructorApplication> list = (status != null && !status.isBlank())
                ? applicationRepository.findByStatus(status.toUpperCase())
                : applicationRepository.findAll();

        return list.stream()
                .map(instructorService::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public InstructorApplicationResponse reviewApplication(Long applicationId, String reviewerUsername, ApplicationReviewRequest request) {
        InstructorApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found: " + applicationId));

        User reviewer = userRepository.findByUsername(reviewerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Reviewer user not found: " + reviewerUsername));

        application.setReviewedBy(reviewer);
        application.setReviewedAt(LocalDateTime.now());

        if (request.isApprove()) {
            application.setStatus("APPROVED");
            application.setRejectionReason(null);

            // Elevate applicant's role to ROLE_INSTRUCTOR
            User applicant = application.getUser();
            Role instructorRole = roleRepository.findByName(RoleEnum.ROLE_INSTRUCTOR)
                    .orElseGet(() -> roleRepository.save(Role.builder().name(RoleEnum.ROLE_INSTRUCTOR).build()));

            applicant.getRoles().add(instructorRole);
            userRepository.save(applicant);
        } else {
            application.setStatus("REJECTED");
            application.setRejectionReason(request.getRejectionReason());
        }

        InstructorApplication saved = applicationRepository.save(application);
        return instructorService.mapToApplicationResponse(saved);
    }
}
