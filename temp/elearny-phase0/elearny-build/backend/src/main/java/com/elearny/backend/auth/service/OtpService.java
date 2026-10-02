package com.elearny.backend.auth.service;

import com.elearny.backend.auth.entity.OtpPurpose;
import com.elearny.backend.auth.entity.OtpVerification;
import com.elearny.backend.auth.entity.User;
import com.elearny.backend.auth.exception.InvalidOtpException;
import com.elearny.backend.auth.exception.OtpCooldownActiveException;
import com.elearny.backend.auth.repository.OtpVerificationRepository;
import com.elearny.backend.common.email.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

/**
 * Same service handles both OtpPurpose values (EMAIL_VERIFICATION now,
 * INSTRUCTOR_SETUP in Phase 2) — the generation/verification mechanics are
 * identical, only the email copy and what happens after success differ,
 * and those live in the callers (AuthService now, the future instructor
 * activation service later), not here.
 */
@Service
public class OtpService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final OtpVerificationRepository otpVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final int expiryMinutes;
    private final int resendCooldownSeconds;

    public OtpService(
            OtpVerificationRepository otpVerificationRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            @Value("${elearny.otp.expiry-minutes:10}") int expiryMinutes,
            @Value("${elearny.otp.resend-cooldown-seconds:60}") int resendCooldownSeconds
    ) {
        this.otpVerificationRepository = otpVerificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.expiryMinutes = expiryMinutes;
        this.resendCooldownSeconds = resendCooldownSeconds;
    }

    @Transactional
    public void generateAndSend(User user, OtpPurpose purpose) {
        enforceCooldown(user, purpose);

        String rawCode = generateSixDigitCode();

        OtpVerification otp = new OtpVerification();
        otp.setUser(user);
        otp.setPurpose(purpose);
        otp.setCodeHash(passwordEncoder.encode(rawCode));
        otp.setExpiresAt(Instant.now().plus(Duration.ofMinutes(expiryMinutes)));
        otpVerificationRepository.save(otp);

        emailService.sendOtpEmail(user.getEmail(), user.getFirstName(), rawCode, expiryMinutes);
    }

    /**
     * @throws OtpCooldownActiveException if the most recent OTP for this
     *                                     user+purpose was sent too recently
     */
    private void enforceCooldown(User user, OtpPurpose purpose) {
        otpVerificationRepository.findFirstByUserIdAndPurposeOrderByCreatedAtDesc(user.getId(), purpose)
                .ifPresent(lastOtp -> {
                    Instant cooldownEnds = lastOtp.getCreatedAt().plusSeconds(resendCooldownSeconds);
                    if (Instant.now().isBefore(cooldownEnds)) {
                        long secondsRemaining = Duration.between(Instant.now(), cooldownEnds).getSeconds();
                        throw new OtpCooldownActiveException(secondsRemaining);
                    }
                });
    }

    /**
     * @throws InvalidOtpException if there's no pending OTP, it's expired,
     *                              or the code doesn't match
     */
    @Transactional
    public void verify(User user, OtpPurpose purpose, String submittedCode) {
        OtpVerification otp = otpVerificationRepository
                .findFirstByUserIdAndPurposeOrderByCreatedAtDesc(user.getId(), purpose)
                .orElseThrow(() -> new InvalidOtpException("No verification code was requested for this account"));

        if (otp.isConsumed()) {
            throw new InvalidOtpException("This code has already been used — request a new one");
        }
        if (otp.isExpired()) {
            throw new InvalidOtpException("This code has expired — request a new one");
        }
        if (!passwordEncoder.matches(submittedCode, otp.getCodeHash())) {
            otp.setAttemptCount(otp.getAttemptCount() + 1);
            otpVerificationRepository.save(otp);
            throw new InvalidOtpException("Incorrect code");
        }

        otp.setConsumedAt(Instant.now());
        otpVerificationRepository.save(otp);
    }

    private String generateSixDigitCode() {
        int code = RANDOM.nextInt(1_000_000); // 0 to 999999 inclusive
        return String.format("%06d", code); // zero-padded, e.g. "004821"
    }
}
