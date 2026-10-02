package com.elearny.backend.instructor.entity;

import com.elearny.backend.auth.entity.User;
import com.elearny.backend.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "instructor_applications")
public class InstructorApplication extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_user_id", nullable = false)
    private User applicant;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String bio;

    @Column(name = "years_experience", nullable = false)
    private int yearsExperience;

    @Column(name = "expertise_tags", nullable = false, columnDefinition = "TEXT")
    private String expertiseTags; // comma-separated — see migration comment for why

    @Column(name = "portfolio_url", length = 500)
    private String portfolioUrl;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_user_id")
    private User reviewedBy;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
}
