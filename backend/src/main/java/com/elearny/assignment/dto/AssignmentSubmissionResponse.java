package com.elearny.assignment.dto;

import com.elearny.assignment.AssignmentSubmission;









import java.time.LocalDateTime;

/** Grading-queue view of a submission — student-safe fields only, one row per student's latest attempt. */
public record AssignmentSubmissionResponse(
        Long id, String studentName, String fileUrl, Integer grade, String feedback,
        LocalDateTime submittedAt, LocalDateTime gradedAt
) {
    public static AssignmentSubmissionResponse from(AssignmentSubmission s) {
        return new AssignmentSubmissionResponse(s.getId(), s.getStudent().getName(), s.getFileUrl(),
                s.getGrade(), s.getFeedback(), s.getSubmittedAt(), s.getGradedAt());
    }
}
