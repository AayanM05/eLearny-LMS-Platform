package com.elearny.service;

import com.elearny.dto.request.*;
import com.elearny.dto.response.AuthResponse;
import com.elearny.dto.response.TotpSetupResponse;
import com.elearny.dto.response.UserSummary;
import com.elearny.entity.*;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.BusinessRuleException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.LoginHistoryRepository;
import com.elearny.repository.UserRepository;
import com.elearny.security.JwtService;
import com.elearny.service.notification.NotificationDispatcher;
import com.elearny.util.HashUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Section 7.1 (Auth) + 7.22 (Account Security). Covers FR1-FR6 and FR59-FR63.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final TotpService totpService;
    private final ConsentService consentService;
    private final AuditService auditService;
    private final NotificationDispatcher notificationDispatcher;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_MINUTES = 15;

    // In-memory challenge-token store: pending 2FA logins (short-lived, single use).
    // A production-grade system would back this with Redis; kept in-process here since
    // this app runs as a single instance (Section 10 - single-service architecture).
    private final Map<String, Long> pendingTwoFactorChallenges = new ConcurrentHashMap<>();
    // Password-reset tokens: token-hash -> userId + expiry, stored similarly.
    private final Map<String, ResetTokenEntry> resetTokens = new ConcurrentHashMap<>();

    private record ResetTokenEntry(Long userId, LocalDateTime expiresAt) {}

    /** UI spec S12/I10 (Account & Security): the data was already being recorded on every
     *  successful login (see completeLogin below) but had no retrieval endpoint until now. */
    public java.util.List<com.elearny.dto.response.LoginHistoryResponse> getLoginHistory(User user, org.springframework.data.domain.Pageable pageable) {
        return loginHistoryRepository.findByUserOrderByLoggedInAtDesc(user, pageable).stream()
                .map(h -> new com.elearny.dto.response.LoginHistoryResponse(h.getIpAddress(), h.getDeviceInfo(), h.getLoggedInAt()))
                .toList();
    }

    @Transactional
    public UserSummary register(RegisterRequest req, String ip) {
        if (userRepository.existsByEmail(req.email())) {
            throw new BusinessRuleException("An account with this email already exists.");
        }
        if (userRepository.existsByPhone(req.phone())) {
            throw new BusinessRuleException("An account with this phone number already exists.");
        }
        if (req.role() != Role.STUDENT && req.role() != Role.INSTRUCTOR) {
            throw new BusinessRuleException("Only Student and Instructor accounts can self-register. "
                    + "Teaching Assistant accounts are created via instructor invitation, and Admin accounts are provisioned internally.");
        }
        if (!req.tosVersion().equals(ConsentService.CURRENT_TOS_VERSION)) {
            throw new BusinessRuleException("Please accept the current Terms of Service version: " + ConsentService.CURRENT_TOS_VERSION);
        }
        boolean isMinor = Boolean.TRUE.equals(req.isUnder18());
        if (isMinor && !Boolean.TRUE.equals(req.parentalConsent())) {
            throw new BusinessRuleException("Parental consent is required for users under 18 before enrolling in paid courses.");
        }
        flagPossibleDuplicateAccount(req.name(), req.email());

        User user = User.builder()
                .name(req.name())
                .email(req.email())
                .phone(req.phone())
                .password(passwordEncoder.encode(req.password()))
                .role(req.role())
                .approved(req.role() == Role.STUDENT) // Instructors start unapproved (FR2)
                .active(true)
                .build();
        user = userRepository.save(user);
        consentService.recordConsent(user, req.tosVersion(), ip, isMinor);
        auditService.log(user, "REGISTER", "User", user.getId(), "role=" + user.getRole());

        notificationDispatcher.dispatch(user, NotificationType.GENERAL,
                "Welcome to eLearny",
                "Thanks for registering, " + user.getName() + "! Your ToS acceptance (v" + req.tosVersion() + ") is on file.",
                "welcome:" + user.getId());

        return UserSummary.from(user);
    }

    private void flagPossibleDuplicateAccount(String name, String email) {
        // FR47 soft check: same name + matching email domain as an existing account.
        String domain = email.contains("@") ? email.substring(email.indexOf('@')) : "";
        boolean possibleDuplicate = userRepository.findAll().stream()
                .anyMatch(u -> u.getName().equalsIgnoreCase(name) && u.getEmail().endsWith(domain));
        if (possibleDuplicate) {
            auditService.log(null, "DUPLICATE_ACCOUNT_FLAG", "User", null, "name=" + name + " domain=" + domain);
        }
    }

    @Transactional
    public AuthResponse login(LoginRequest req, String ip, String deviceInfo) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new com.elearny.exception.AccessDeniedCustomException("Invalid email or password."));

        if (user.isLocked()) {
            throw new BusinessRuleException("Account locked due to repeated failed logins. Try again after "
                    + LOCKOUT_MINUTES + " minutes.");
        }

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            registerFailedAttempt(user);
            throw new com.elearny.exception.AccessDeniedCustomException("Invalid email or password.");
        }

        user.setFailedLoginAttempts(0);
        userRepository.save(user);

        // FR59: mandatory 2FA for Instructor/Admin; optional (if enabled) for Student/TA
        boolean requires2fa = user.isTotpEnabled() || user.getRole() == Role.INSTRUCTOR || user.getRole() == Role.ADMIN;

        if (requires2fa && !user.isTotpEnabled()) {
            // Mandatory role but not yet enrolled in 2FA: still issue tokens (the person needs to be
            // authenticated to call the /2fa/setup and /2fa/activate endpoints), but flag it so the
            // frontend forces them through setup before letting them use anything else.
            AuthResponse loggedIn = completeLogin(user, ip, deviceInfo);
            return new AuthResponse("2FA_SETUP_REQUIRED", loggedIn.accessToken(), loggedIn.refreshToken(), null, loggedIn.user());
        }
        if (requires2fa) {
            String challengeToken = com.elearny.util.CodeGenerator.randomToken();
            pendingTwoFactorChallenges.put(challengeToken, user.getId());
            return new AuthResponse("2FA_REQUIRED", null, null, challengeToken, UserSummary.from(user));
        }

        return completeLogin(user, ip, deviceInfo);
    }

    private void registerFailedAttempt(User user) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);
        if (attempts >= MAX_FAILED_ATTEMPTS) {
            user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES)); // FR5
        }
        userRepository.save(user);
    }

    @Transactional
    public AuthResponse complete2faChallenge(TwoFactorChallengeRequest req, String ip, String deviceInfo) {
        Long userId = pendingTwoFactorChallenges.get(req.challengeToken());
        if (userId == null) {
            throw new AccessDeniedCustomException("Challenge token invalid or expired.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!totpService.verifyCode(user.getTotpSecret(), req.code())) {
            throw new AccessDeniedCustomException("Invalid 2FA code.");
        }
        pendingTwoFactorChallenges.remove(req.challengeToken());
        return completeLogin(user, ip, deviceInfo);
    }

    private AuthResponse completeLogin(User user, String ip, String deviceInfo) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = refreshTokenService.issue(user);
        loginHistoryRepository.save(LoginHistory.builder()
                .user(user).ipAddress(ip).deviceInfo(deviceInfo).loggedInAt(LocalDateTime.now()).build());
        return AuthResponse.success(accessToken, refreshToken, UserSummary.from(user));
    }

    @Transactional
    public TotpSetupResponse setupTwoFactor(User user) {
        String secret = totpService.generateSecret();
        user.setTotpSecret(secret);
        userRepository.save(user);
        String qr = totpService.buildQrDataUri(secret, user.getEmail());
        return new TotpSetupResponse(secret, qr);
    }

    @Transactional
    public void verifyAndActivateTwoFactor(User user, String code) {
        if (user.getTotpSecret() == null || !totpService.verifyCode(user.getTotpSecret(), code)) {
            throw new BusinessRuleException("Invalid 2FA code.");
        }
        user.setTotpEnabled(true);
        userRepository.save(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest req) {
        RefreshTokenService.RotationResult result = refreshTokenService.rotate(req.refreshToken());
        String accessToken = jwtService.generateAccessToken(result.user().getId(), result.user().getEmail(), result.user().getRole().name());
        return AuthResponse.success(accessToken, result.newRefreshToken(), UserSummary.from(result.user()));
    }

    @Transactional
    public void logoutAll(User user) {
        refreshTokenService.revokeAllForUser(user); // FR62
    }

    @Transactional
    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String rawToken = com.elearny.util.CodeGenerator.randomToken();
            resetTokens.put(HashUtils.sha256(rawToken), new ResetTokenEntry(user.getId(), LocalDateTime.now().plusMinutes(15)));
            notificationDispatcher.dispatch(user, NotificationType.PASSWORD_RESET,
                    "Reset your eLearny password",
                    "Use this token within 15 minutes to reset your password: " + rawToken,
                    "password-reset:" + user.getId() + ":" + System.currentTimeMillis());
        });
        // Always return silently regardless of whether the email exists, to avoid account enumeration.
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        String hash = HashUtils.sha256(req.token());
        ResetTokenEntry entry = resetTokens.get(hash);
        if (entry == null || entry.expiresAt().isBefore(LocalDateTime.now())) {
            throw new AccessDeniedCustomException("Reset token invalid or expired.");
        }
        User user = userRepository.findById(entry.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);
        resetTokens.remove(hash);
        refreshTokenService.revokeAllForUser(user); // FR61: revoke all existing sessions on reset
    }
}
