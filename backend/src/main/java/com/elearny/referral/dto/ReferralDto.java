package com.elearny.referral.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReferralDto {
    private String userReferralCode;
    private String referralLink;
    private long totalReferralsCount;
    private int totalXpEarned;
}
