package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_submissions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AssignmentSubmission extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    private String fileUrl;

    private Integer grade;

    @Lob
    private String feedback;

    private LocalDateTime submittedAt;

    private LocalDateTime gradedAt;

    // Append-only: resubmission supersedes but does not delete prior submission
    @Builder.Default
    private boolean superseded = false;
}
