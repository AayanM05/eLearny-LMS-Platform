package com.elearny.service;

import com.elearny.dto.request.InstructorUnavailabilityRequest;
import com.elearny.entity.InstructorLeave;
import com.elearny.entity.LeaveStatus;
import com.elearny.entity.User;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.InstructorLeaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Section 7.16 (Instructor Availability): FR57. */
@Service
@RequiredArgsConstructor
public class InstructorAvailabilityService {

    private final InstructorLeaveRepository instructorLeaveRepository;

    @Transactional
    public InstructorLeave markUnavailable(User instructor, InstructorUnavailabilityRequest req) {
        InstructorLeave leave = InstructorLeave.builder()
                .instructor(instructor).startDate(req.startDate()).endDate(req.endDate())
                .reason(req.reason()).status(LeaveStatus.ACTIVE).build();
        return instructorLeaveRepository.save(leave);
    }

    @Transactional
    public void cancel(User instructor, Long leaveId) {
        InstructorLeave leave = instructorLeaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave record not found"));
        if (!leave.getInstructor().getId().equals(instructor.getId())) {
            throw new com.elearny.exception.AccessDeniedCustomException("This leave record does not belong to you.");
        }
        leave.setStatus(LeaveStatus.CANCELLED);
        instructorLeaveRepository.save(leave);
    }
}
