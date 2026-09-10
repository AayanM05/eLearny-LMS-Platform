package com.elearny.auth.service;

import com.elearny.auth.dto.*;
import com.elearny.common.exception.ResourceNotFoundException;
import com.elearny.common.security.JwtProvider;
import com.elearny.user.entity.Role;
import com.elearny.user.entity.User;
import com.elearny.user.mapper.UserMapper;
import com.elearny.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final TotpService totpService;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public CheckUsernameResponse checkUsername(String username) {
        if (username == null || username.trim().length() < 3) {
            return CheckUsernameResponse.builder()
                    .available(false)
                    .suggestions(List.of())
                    .build();
        }
        boolean exists = userRepository.existsByUsername(username.trim());
        if (!exists) {
            return CheckUsernameResponse.builder()
                    .available(true)
                    .suggestions(List.of())
                    .build();
        }
        List<String> suggestions = new ArrayList<>();
        int suffix = 1;
        while (suggestions.size() < 3) {
            String candidate = username.trim() + suffix;
            if (!userRepository.existsByUsername(candidate)) {
                suggestions.add(candidate);
            }
            suffix++;
        }
        return CheckUsernameResponse.builder()
                .available(false)
                .suggestions(suggestions)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }
        if (request.getUsername() != null && userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername() != null ? request.getUsername().trim() : null)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.STUDENT)
                .totpEnabled(false)
                .failedLoginAttempts(0)
                .build();

        User savedUser = userRepository.save(user);

        String accessToken = jwtProvider.generateAccessToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole());
        String refreshToken = jwtProvider.generateRefreshToken(savedUser.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .is2faRequired(false)
                .user(userMapper.toDto(savedUser))
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (user.getAccountLockedUntil() != null && user.getAccountLockedUntil().isAfter(Instant.now())) {
            throw new BadCredentialsException("Account is temporarily locked due to multiple failed login attempts. Try again later.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);
            if (attempts >= 5) {
                user.setAccountLockedUntil(Instant.now().plus(15, ChronoUnit.MINUTES));
            }
            userRepository.save(user);
            throw new BadCredentialsException("Invalid email or password");
        }

        user.setFailedLoginAttempts(0);
        user.setAccountLockedUntil(null);
        userRepository.save(user);

        if (user.isTotpEnabled()) {
            String pending2faToken = jwtProvider.generatePending2FaToken(user.getId());
            return AuthResponse.builder()
                    .is2faRequired(true)
                    .pending2faToken(pending2faToken)
                    .build();
        }

        String accessToken = jwtProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .is2faRequired(false)
                .user(userMapper.toDto(user))
                .build();
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            user.setPasswordResetToken(UUID.randomUUID().toString());
            user.setPasswordResetExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS));
            userRepository.save(user);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired password reset token"));

        if (user.getPasswordResetExpiresAt() == null || user.getPasswordResetExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Invalid or expired password reset token");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiresAt(null);
        user.setFailedLoginAttempts(0);
        user.setAccountLockedUntil(null);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse verify2fa(Verify2FaRequest request) {
        if (!jwtProvider.validateToken(request.getPending2faToken())) {
            throw new BadCredentialsException("Invalid or expired 2FA session token");
        }

        Claims claims = jwtProvider.getClaimsFromToken(request.getPending2faToken());
        if (!"PENDING_2FA".equals(claims.get("type", String.class))) {
            throw new BadCredentialsException("Invalid token type for 2FA verification");
        }

        UUID userId = UUID.fromString(claims.getSubject());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!totpService.verifyCode(user.getTotpSecret(), request.getTotpCode())) {
            throw new BadCredentialsException("Invalid 2FA code");
        }

        String accessToken = jwtProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .is2faRequired(false)
                .user(userMapper.toDto(user))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!jwtProvider.validateToken(request.getRefreshToken())) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        Claims claims = jwtProvider.getClaimsFromToken(request.getRefreshToken());
        if (!"REFRESH".equals(claims.get("type", String.class))) {
            throw new BadCredentialsException("Invalid token type");
        }

        UUID userId = UUID.fromString(claims.getSubject());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newAccessToken = jwtProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String newRefreshToken = jwtProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .is2faRequired(false)
                .user(userMapper.toDto(user))
                .build();
    }

    @Transactional
    public TotpSetupResponse setup2fa(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String secret = totpService.generateSecret();
        user.setTotpSecret(secret);
        user.setTotpEnabled(true);
        userRepository.save(user);

        try {
            String qrCodeDataUri = totpService.getQrCodeDataUri(secret, user.getEmail());
            return TotpSetupResponse.builder()
                    .secret(secret)
                    .qrCodeDataUri(qrCodeDataUri)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code for 2FA setup", e);
        }
    }
}
