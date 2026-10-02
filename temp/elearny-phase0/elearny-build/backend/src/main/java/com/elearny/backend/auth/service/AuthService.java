package com.elearny.backend.auth.service;

import com.elearny.backend.auth.dto.LoginRequest;
import com.elearny.backend.auth.dto.LoginResponse;
import com.elearny.backend.auth.dto.RefreshRequest;
import com.elearny.backend.auth.dto.RefreshResponse;
import com.elearny.backend.auth.dto.RegisterRequest;
import com.elearny.backend.auth.dto.RegisterResponse;
import com.elearny.backend.auth.entity.ConsentRecord;
import com.elearny.backend.auth.entity.OtpPurpose;
import com.elearny.backend.auth.entity.Role;
import com.elearny.backend.auth.entity.User;
import com.elearny.backend.auth.exception.AccountLockedException;
import com.elearny.backend.auth.exception.EmailAlreadyRegisteredException;
import com.elearny.backend.auth.exception.EmailNotVerifiedException;
import com.elearny.backend.auth.exception.InvalidCredentialsException;
import com.elearny.backend.auth.exception.InvalidOtpException;
import com.elearny.backend.auth.exception.InvalidRefreshTokenException;
import com.elearny.backend.auth.exception.UsernameAlreadyTakenException;
import com.elearny.backend.auth.repository.ConsentRecordRepository;
import com.elearny.backend.auth.repository.UserRepository;
import com.elearny.backend.common.security.JwtService;
import io.jsonwebtoken.JwtException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ConsentRecordRepository consentRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtService jwtService;
    private final AccountLockoutService accountLockoutService;

    public AuthService(UserRepository userRepository,
                        ConsentRecordRepository consentRecordRepository,
                        PasswordEncoder passwordEncoder,
                        OtpService otpService,
                        JwtService jwtService,
                        AccountLockoutService accountLockoutService) {
        this.userRepository = userRepository;
        this.consentRecordRepository = consentRecordRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.jwtService = jwtService;
        this.accountLockoutService = accountLockoutService;
    }

    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsernameIgnoreCase(username);
    }

    /**
     * @param ipAddress the registering client's IP, recorded on the consent
     *                  row per prd.md §3.25 — passed in from the controller
     *                  since that's the only layer with access to the raw
     *                  HttpServletRequest.
     */
    @Transactional
    public RegisterResponse register(RegisterRequest request, String ipAddress) {
        if (userRepository.existsByUsernameIgnoreCase(request.username())) {
            throw new UsernameAlreadyTakenException(request.username());
        }
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new EmailAlreadyRegisteredException(request.email());
        }
        // request.termsAccepted() is already guaranteed true by @AssertTrue
        // validation before this method runs — no need to re-check it here.

        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(Role.STUDENT); // every self-service registration is a Student;
        // Instructor elevation happens via the separate application/approval
        // flow in Phase 2, never at registration time — see pages.md §1.1's
        // v1.2 changelog entry for why the old Role Selection Toggle was removed.
        user.setEmailVerified(false); // per prd.md §3.26 — cleared only by verifyEmail()

        User saved = userRepository.save(user);

        ConsentRecord consent = new ConsentRecord();
        consent.setUser(saved);
        consent.setConsentType("TERMS_OF_SERVICE_AND_PRIVACY_POLICY");
        consent.setAccepted(true);
        consent.setAcceptedAt(Instant.now());
        consent.setIpAddress(ipAddress);
        consentRecordRepository.save(consent);

        otpService.generateAndSend(saved, OtpPurpose.EMAIL_VERIFICATION);

        return toRegisterResponse(saved);
    }

    @Transactional
    public void verifyEmail(String email, String otpCode) {
        User user = userRepository.findByEmailIgnoreCase(email)
                // Deliberately the same generic message as a wrong code —
                // never reveal whether the email itself exists via this endpoint.
                .orElseThrow(() -> new InvalidOtpException("Incorrect code"));

        if (user.isEmailVerified()) {
            throw new InvalidOtpException("This account is already verified");
        }

        otpService.verify(user, OtpPurpose.EMAIL_VERIFICATION, otpCode);

        user.setEmailVerified(true);
        userRepository.save(user);
    }

    /**
     * Always completes without revealing whether the email is registered —
     * only sends (and only throws a cooldown error) when a matching,
     * unverified account actually exists. A cooldown 429 vs. a silent 200 is
     * a minor remaining enumeration side-channel worth hardening later
     * (e.g. always responding after a fixed delay), not solved here.
     */
    @Transactional
    public void resendOtp(String email) {
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            if (!user.isEmailVerified()) {
                otpService.generateAndSend(user, OtpPurpose.EMAIL_VERIFICATION);
            }
        });
    }

    /**
     * Order of checks is deliberate: existence and password are checked
     * together (identical error either way, so a wrong password never
     * confirms an account exists) BEFORE the locked/unverified checks —
     * those two DO reveal account existence via a distinct message, which
     * is an accepted, common trade-off (a real locked-out user needs to
     * know they're locked, not get a generic "wrong password" that sends
     * them down a password-reset dead end). TOTP 2FA is not wired in yet —
     * that's a follow-up sub-slice, not forgotten.
     */
    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository
                .findByUsernameIgnoreCaseOrEmailIgnoreCase(request.usernameOrEmail(), request.usernameOrEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (user.isAccountLocked()) {
            throw new AccountLockedException();
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            accountLockoutService.recordFailedAttempt(user);
            throw new InvalidCredentialsException();
        }

        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException();
        }

        accountLockoutService.recordSuccessfulLogin(user);

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        return new LoginResponse(
                accessToken,
                refreshToken,
                "Bearer",
                jwtService.getAccessTokenExpirySeconds(),
                toRegisterResponse(user)
        );
    }

    @Transactional
    public RefreshResponse refresh(RefreshRequest request) {
        UUID userId;
        try {
            var claims = jwtService.parseAndValidate(request.refreshToken());
            if (!jwtService.isRefreshToken(claims)) {
                throw new InvalidRefreshTokenException();
            }
            userId = jwtService.getUserId(claims);
        } catch (JwtException | IllegalArgumentException e) {
            throw new InvalidRefreshTokenException();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(InvalidRefreshTokenException::new);

        if (user.isAccountLocked()) {
            throw new AccountLockedException();
        }

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getRole().name());
        return new RefreshResponse(accessToken, "Bearer", jwtService.getAccessTokenExpirySeconds());
    }

    private RegisterResponse toRegisterResponse(User user) {
        return new RegisterResponse(user.getId(), user.getFirstName(), user.getUsername(), user.getEmail(), user.getRole().name());
    }
}
