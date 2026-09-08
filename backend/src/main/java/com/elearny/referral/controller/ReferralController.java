package com.elearny.referral.controller;

import com.elearny.referral.dto.ClaimReferralRequest;
import com.elearny.referral.dto.ReferralDto;
import com.elearny.referral.service.ReferralService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/referrals")
@RequiredArgsConstructor
public class ReferralController {

    private final ReferralService referralService;

    @GetMapping("/my-code")
    public ResponseEntity<ReferralDto> getMyReferralInfo(@AuthenticationPrincipal String userId) {
        ReferralDto info = referralService.getReferralInfo(UUID.fromString(userId));
        return ResponseEntity.ok(info);
    }

    @PostMapping("/claim")
    public ResponseEntity<Void> claimReferral(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody ClaimReferralRequest request) {
        referralService.claimReferral(UUID.fromString(userId), request);
        return ResponseEntity.ok().build();
    }
}
