package com.elearny.referral.repository;

import com.elearny.referral.entity.Referral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, UUID> {
    List<Referral> findByReferrerIdOrderByCreatedAtDesc(UUID referrerId);
    boolean existsByReferredId(UUID referredId);
}
