package com.elearny.referral.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClaimReferralRequest {
    @NotBlank
    private String referralCode;
}
