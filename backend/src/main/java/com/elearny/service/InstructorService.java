package com.elearny.service;

import com.elearny.dto.*;
import com.elearny.entity.*;
import com.elearny.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructorService {

    private final InstructorApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final InstructorLeaveRepository leaveRepository;
    private final LiveSessionSlotRepository slotRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public InstructorApplicationResponse applyForInstructor(String username, InstructorApplicationRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        applicationRepository.findByUserId(user.getId()).ifPresent(app -> {
            if ("PENDING".equals(app.getStatus())) {
                throw new IllegalStateException("You already have a pending instructor application");
            }
        });

        InstructorApplication application = InstructorApplication.builder()
                .user(user)
                .bio(request.getBio())
                .experienceYears(request.getExperienceYears())
                .expertiseTags(request.getExpertiseTags())
                .portfolioUrl(request.getPortfolioUrl())
                .resumeUrl(request.getResumeUrl())
                .status("PENDING")
                .build();

        InstructorApplication saved = applicationRepository.save(application);
        return mapToApplicationResponse(saved);
    }

    public InstructorApplicationResponse getMyApplication(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        InstructorApplication application = applicationRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("No instructor application found for user"));

        return mapToApplicationResponse(application);
    }

    @Transactional
    public InstructorLeave addLeave(String username, InstructorLeaveRequest request) {
        User instructor = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        InstructorLeave leave = InstructorLeave.builder()
                .instructor(instructor)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .build();

        return leaveRepository.save(leave);
    }

    public List<InstructorLeave> getMyLeaves(String username) {
        User instructor = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return leaveRepository.findByInstructorId(instructor.getId());
    }

    @Transactional
    public LiveSessionSlotResponse createLiveSlot(String username, LiveSessionSlotRequest request) {
        User instructor = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        Course course = null;
        if (request.getCourseId() != null) {
            course = courseRepository.findById(request.getCourseId())
                    .orElse(null);
        }

        LiveSessionSlot slot = LiveSessionSlot.builder()
                .instructor(instructor)
                .course(course)
                .title(request.getTitle())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .maxCapacity(request.getMaxCapacity() > 0 ? request.getMaxCapacity() : 1)
                .meetingLink(request.getMeetingLink())
                .status("AVAILABLE")
                .build();

        LiveSessionSlot saved = slotRepository.save(slot);
        return mapToSlotResponse(saved);
    }

    public List<LiveSessionSlotResponse> getMyLiveSlots(String username) {
        User instructor = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return slotRepository.findByInstructorId(instructor.getId()).stream()
                .map(this::mapToSlotResponse)
                .collect(Collectors.toList());
    }

    public InstructorApplicationResponse mapToApplicationResponse(InstructorApplication app) {
        return InstructorApplicationResponse.builder()
                .id(app.getId())
                .userId(app.getUser().getId())
                .userFullName(app.getUser().getFullName())
                .userEmail(app.getUser().getEmail())
                .bio(app.getBio())
                .experienceYears(app.getExperienceYears())
                .expertiseTags(app.getExpertiseTags())
                .portfolioUrl(app.getPortfolioUrl())
                .resumeUrl(app.getResumeUrl())
                .status(app.getStatus())
                .rejectionReason(app.getRejectionReason())
                .reviewedByUserId(app.getReviewedBy() != null ? app.getReviewedBy().getId() : null)
                .reviewedAt(app.getReviewedAt())
                .createdAt(app.getCreatedAt())
                .build();
    }

    private LiveSessionSlotResponse mapToSlotResponse(LiveSessionSlot slot) {
        return LiveSessionSlotResponse.builder()
                .id(slot.getId())
                .instructorId(slot.getInstructor().getId())
                .instructorName(slot.getInstructor().getFullName())
                .courseId(slot.getCourse() != null ? slot.getCourse().getId() : null)
                .courseTitle(slot.getCourse() != null ? slot.getCourse().getTitle() : null)
                .title(slot.getTitle())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .maxCapacity(slot.getMaxCapacity())
                .bookedCount(0)
                .meetingLink(slot.getMeetingLink())
                .status(slot.getStatus())
                .createdAt(slot.getCreatedAt())
                .build();
    }
}
