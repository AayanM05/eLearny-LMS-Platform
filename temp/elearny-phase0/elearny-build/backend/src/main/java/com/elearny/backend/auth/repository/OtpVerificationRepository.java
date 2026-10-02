package com.elearny.backend.auth.repository;

import com.elearny.backend.auth.entity.OtpPurpose;
import com.elearny.backend.auth.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, UUID> {

    /**
     * Most recent OTP for a given user+purpose — resending or verifying
     * always acts on the latest one, older rows are kept only as an audit
     * trail (see V4 migration comment).
     */
    Optional<OtpVerification> findFirstByUserIdAndPurposeOrderByCreatedAtDesc(UUID userId, OtpPurpose purpose);
}
