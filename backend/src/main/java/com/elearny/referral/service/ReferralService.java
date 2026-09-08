package com.elearny.referral.service;

import com.elearny.gamification.service.GamificationService;
import com.elearny.referral.dto.ClaimReferralRequest;
import com.elearny.referral.dto.ReferralDto;
import com.elearny.referral.entity.Referral;
import com.elearny.referral.repository.ReferralRepository;
import com.elearny.user.entity.User;
import com.elearny.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReferralService {

    private final ReferralRepository referralRepository;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    @Transactional(readOnly = true)
    public ReferralDto getReferralInfo(UUID userId) {
        String code = "REF-" + userId.toString().substring(0, 8).toUpperCase();
        List<Referral> referrals = referralRepository.findByReferrerIdOrderByCreatedAtDesc(userId);

        int totalXp = referrals.stream().mapToInt(Referral::getRewardXp).sum();

        return ReferralDto.builder()
                .userReferralCode(code)
                .referralLink(baseUrl + "/register?ref=" + code)
                .totalReferralsCount(referrals.size())
                .totalXpEarned(totalXp)
                .build();
    }

    @Transactional
    public void claimReferral(UUID referredUserId, ClaimReferralRequest request) {
        if (referralRepository.existsByReferredId(referredUserId)) {
            throw new IllegalArgumentException("Referral reward has already been claimed for this account.");
        }

        User referredUser = userRepository.findById(referredUserId)
                .orElseThrow(() -> new IllegalArgumentException("Referred user not found: " + referredUserId));

        // Find referrer by matching prefix code in database users
        String cleanCode = request.getReferralCode().trim().toUpperCase();
        User referrer = userRepository.findAll().stream()
                .filter(u -> ("REF-" + u.getId().toString().substring(0, 8).toUpperCase()).equals(cleanCode))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid referral code: " + request.getReferralCode()));

        if (referrer.getId().equals(referredUserId)) {
            throw new IllegalArgumentException("Cannot use your own referral code.");
        }

        Referral referral = Referral.builder()
                .referrer(referrer)
                .referred(referredUser)
                .referralCode(cleanCode)
                .rewardXp(200)
                .build();

        referralRepository.save(referral);

        // Award +200 XP to referrer & +100 XP bonus to referred user
        gamificationService.awardXp(referrer.getId(), 200);
        gamificationService.awardXp(referredUserId, 100);
    }
}
