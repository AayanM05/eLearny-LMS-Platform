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

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final TotpService totpService;
    private final UserMapper userMapper;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.STUDENT)
                .totpEnabled(false)
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

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

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
