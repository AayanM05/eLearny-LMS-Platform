package com.elearny.service;

import com.elearny.dto.request.TaInviteRequest;
import com.elearny.entity.*;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.BusinessRuleException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.TaAssignmentRepository;
import com.elearny.repository.UserRepository;
import com.elearny.service.notification.NotificationDispatcher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Section 7.9 (TA Management): FR39/FR40 — course-scoped invitation, revocable by the owning instructor. */
@Service
@RequiredArgsConstructor
public class TaService {

    private final TaAssignmentRepository taAssignmentRepository;
    private final UserRepository userRepository;
    private final CourseService courseService;
    private final NotificationDispatcher notificationDispatcher;

    @Transactional
    public TaAssignment invite(User instructor, Long courseId, TaInviteRequest req) {
        Course course = courseService.findEntity(courseId);
        courseService.assertOwnerOrAdmin(instructor, course);
        User taUser = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new ResourceNotFoundException("No user found with that email."));
        if (taUser.getRole() != Role.TEACHING_ASSISTANT) {
            throw new BusinessRuleException("The invited user must have the Teaching Assistant role.");
        }
        taAssignmentRepository.findByCourseAndTaUser(course, taUser).ifPresent(existing -> {
            throw new BusinessRuleException("This user is already invited/assigned to this course.");
        });
        TaAssignment assignment = TaAssignment.builder()
                .course(course).taUser(taUser).invitedBy(instructor).status(TaStatus.PENDING).build();
        assignment = taAssignmentRepository.save(assignment);

        notificationDispatcher.dispatch(taUser, NotificationType.TA_INVITATION,
                "You've been invited as a TA for " + course.getTitle(),
                "Accept the invitation in your dashboard to start grading and moderating for this course.",
                "ta-invite:" + assignment.getId());
        return assignment;
    }

    @Transactional
    public void accept(User taUser, Long assignmentId) {
        TaAssignment assignment = taAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));
        if (!assignment.getTaUser().getId().equals(taUser.getId())) {
            throw new AccessDeniedCustomException("This invitation is not addressed to you.");
        }
        assignment.setStatus(TaStatus.ACTIVE);
        taAssignmentRepository.save(assignment);
    }

    @Transactional
    public void revoke(User instructor, Long assignmentId) {
        TaAssignment assignment = taAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
        courseService.assertOwnerOrAdmin(instructor, assignment.getCourse());
        assignment.setStatus(TaStatus.REVOKED); // FR40 - immediate access revocation
        taAssignmentRepository.save(assignment);
    }

    public java.util.List<TaAssignment> myInvitations(User taUser) {
        return taAssignmentRepository.findByTaUser(taUser);
    }

    public java.util.List<TaAssignment> forCourse(User requester, Long courseId) {
        Course course = courseService.findEntity(courseId);
        courseService.assertOwnerOrAdmin(requester, course);
        return taAssignmentRepository.findByCourseAndStatusNot(course, TaStatus.REVOKED);
    }
}
