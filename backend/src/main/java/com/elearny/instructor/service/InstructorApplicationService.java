package com.elearny.instructor.service;

import com.elearny.common.exception.ResourceNotFoundException;
import com.elearny.instructor.dto.ApplyInstructorRequest;
import com.elearny.instructor.dto.InstructorApplicationResponse;
import com.elearny.instructor.dto.ReviewApplicationRequest;
import com.elearny.instructor.entity.ApplicationStatus;
import com.elearny.instructor.entity.InstructorApplication;
import com.elearny.instructor.repository.InstructorApplicationRepository;
import com.elearny.user.entity.Role;
import com.elearny.user.entity.User;
import com.elearny.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructorApplicationService {

    private final InstructorApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @Transactional
    public InstructorApplicationResponse submitApplication(UUID userId, ApplyInstructorRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getRole() == Role.INSTRUCTOR) {
            throw new IllegalStateException("User is already an approved instructor");
        }

        applicationRepository.findByUserId(userId).ifPresent(existing -> {
            if (existing.getStatus() == ApplicationStatus.PENDING) {
                throw new IllegalStateException("You already have an active pending instructor application");
            }
        });

        InstructorApplication application = applicationRepository.findByUserId(userId)
                .orElseGet(() -> InstructorApplication.builder().user(user).build());

        application.setHeadline(request.getHeadline());
        application.setBio(request.getBio());
        application.setExperienceYears(request.getExperienceYears());
        application.setSampleVideoUrl(request.getSampleVideoUrl());
        application.setStatus(ApplicationStatus.PENDING);
        application.setAdminNotes(null);

        InstructorApplication saved = applicationRepository.save(application);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public InstructorApplicationResponse getApplicationStatusForUser(UUID userId) {
        InstructorApplication application = applicationRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No instructor application found for user: " + userId));
        return mapToResponse(application);
    }

    @Transactional(readOnly = true)
    public List<InstructorApplicationResponse> getApplicationsByStatus(ApplicationStatus status) {
        List<InstructorApplication> apps = status != null
                ? applicationRepository.findByStatusOrderByCreatedAtDesc(status)
                : applicationRepository.findAll();
        return apps.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public InstructorApplicationResponse reviewApplication(UUID applicationId, ReviewApplicationRequest request) {
        InstructorApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        application.setStatus(request.getStatus());
        application.setAdminNotes(request.getAdminNotes());

        if (request.getStatus() == ApplicationStatus.APPROVED) {
            User user = application.getUser();
            user.setRole(Role.INSTRUCTOR);
            userRepository.save(user);
        }

        InstructorApplication saved = applicationRepository.save(application);
        return mapToResponse(saved);
    }

    private InstructorApplicationResponse mapToResponse(InstructorApplication app) {
        return InstructorApplicationResponse.builder()
                .id(app.getId())
                .userId(app.getUser().getId())
                .userFullName(app.getUser().getFullName())
                .userEmail(app.getUser().getEmail())
                .headline(app.getHeadline())
                .bio(app.getBio())
                .experienceYears(app.getExperienceYears())
                .sampleVideoUrl(app.getSampleVideoUrl())
                .status(app.getStatus())
                .adminNotes(app.getAdminNotes())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
