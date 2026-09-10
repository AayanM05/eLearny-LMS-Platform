package com.elearny.service;

import com.elearny.dto.request.AssignmentCreateRequest;
import com.elearny.dto.request.AssignmentGradeRequest;
import com.elearny.dto.request.AssignmentSubmitRequest;
import com.elearny.entity.*;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.BusinessRuleException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.AssignmentRepository;
import com.elearny.repository.AssignmentSubmissionRepository;
import com.elearny.repository.EnrollmentRepository;
import com.elearny.repository.TaAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/** Section 7.4 (Assignment): FR16-FR18 — append-only resubmission for grading-dispute traceability. */
@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final TaAssignmentRepository taAssignmentRepository;
    private final CourseContentService courseContentService;
    private final CourseService courseService;
    private final ProgressService progressService;

    @Transactional
    public Assignment createAssignment(User requester, Long subsectionId, AssignmentCreateRequest req) {
        Subsection subsection = courseContentService.findSubsection(subsectionId);
        if (subsection.getContentType() != ContentType.ASSIGNMENT) {
            throw new BusinessRuleException("Sub-section is not of type ASSIGNMENT.");
        }
        courseService.assertOwnerOrAdmin(requester, subsection.getSection().getCourse());
        Assignment assignment = Assignment.builder()
                .subsection(subsection).instructions(req.instructions())
                .allowedFileTypes(req.allowedFileTypes()).dueDate(req.dueDate()).build();
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public AssignmentSubmission submit(User student, Long assignmentId, AssignmentSubmitRequest req) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
        Course course = assignment.getSubsection().getSection().getCourse();
        if (!enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)) {
            throw new AccessDeniedCustomException("You must be enrolled to submit this assignment.");
        }
        if (assignment.getDueDate() != null && LocalDateTime.now().isAfter(assignment.getDueDate())) {
            submissionRepository.findFirstByAssignmentAndStudentAndSupersededFalse(assignment, student)
                    .ifPresentOrElse(s -> { throw new BusinessRuleException("Resubmission window has closed (past due date)."); },
                            () -> { throw new BusinessRuleException("Submission window has closed (past due date)."); });
        }
        // FR18: resubmission supersedes but does not delete the prior submission (append-only)
        submissionRepository.findFirstByAssignmentAndStudentAndSupersededFalse(assignment, student)
                .ifPresent(prior -> { prior.setSuperseded(true); submissionRepository.save(prior); });

        AssignmentSubmission submission = AssignmentSubmission.builder()
                .assignment(assignment).student(student).fileUrl(req.fileUrl())
                .submittedAt(LocalDateTime.now()).superseded(false).build();
        return submissionRepository.save(submission);
    }

    @Transactional
    public AssignmentSubmission grade(User requester, Long submissionId, AssignmentGradeRequest req) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        Course course = submission.getAssignment().getSubsection().getSection().getCourse();
        assertInstructorOrScopedTa(requester, course);

        submission.setGrade(req.grade());
        submission.setFeedback(req.feedback());
        submission.setGradedAt(LocalDateTime.now());
        submission = submissionRepository.save(submission);

        progressService.markCompleteSystem(submission.getStudent(), submission.getAssignment().getSubsection());
        return submission;
    }

    /** Grading queue for an assignment: latest (non-superseded) submission per student. */
    public java.util.List<com.elearny.dto.response.AssignmentSubmissionResponse> listSubmissions(User requester, Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
        Course course = assignment.getSubsection().getSection().getCourse();
        assertInstructorOrScopedTa(requester, course);
        return submissionRepository.findByAssignmentAndSupersededFalseOrderBySubmittedAtDesc(assignment).stream()
                .map(com.elearny.dto.response.AssignmentSubmissionResponse::from).toList();
    }

    /** FR39/FR40: a TA can grade only for the course(s) they're actively assigned to. */
    private void assertInstructorOrScopedTa(User requester, Course course) {
        if (requester.getRole() == Role.ADMIN) return;
        boolean isOwningInstructor = requester.getRole() == Role.INSTRUCTOR
                && course.getInstructor().getId().equals(requester.getId());
        boolean isScopedTa = requester.getRole() == Role.TEACHING_ASSISTANT
                && taAssignmentRepository.existsByCourseAndTaUserAndStatus(course, requester, TaStatus.ACTIVE);
        if (!isOwningInstructor && !isScopedTa) {
            throw new AccessDeniedCustomException("You are not authorized to grade submissions for this course.");
        }
    }
}
