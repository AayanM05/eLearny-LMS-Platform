package com.elearny.backend.auth.entity;

import com.elearny.backend.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * One row per consent event (not one row per user) — per prd.md §3.25, basic
 * GDPR consent recording is V1; this table is the audit trail proving *when*
 * and under what IP a user accepted a given policy version, which a single
 * boolean flag on the User row could never reconstruct later.
 */
@Getter
@Setter
@Entity
@Table(name = "consent_records")
public class ConsentRecord extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "consent_type", nullable = false, length = 50)
    private String consentType; // e.g. "TERMS_OF_SERVICE", "PRIVACY_POLICY"

    @Column(nullable = false)
    private boolean accepted;

    @Column(name = "accepted_at", nullable = false)
    private Instant acceptedAt;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;
}
