package com.elearny.service;

import com.elearny.entity.RefreshToken;
import com.elearny.entity.User;
import com.elearny.repository.RefreshTokenRepository;
import com.elearny.security.JwtService;
import com.elearny.util.HashUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * FR3: refresh tokens are opaque, rotated on every use, and stored hashed (never in plaintext) —
 * so a leaked DB dump doesn't expose usable tokens, mirroring FR4's treatment of passwords.
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    @Value("${app.jwt.refresh-token-expiry-days:7}")
    private long refreshTokenExpiryDays;

    public String issue(User user) {
        String raw = jwtService.generateOpaqueRefreshToken();
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .tokenHash(HashUtils.sha256(raw))
                .expiresAt(LocalDateTime.now().plusDays(refreshTokenExpiryDays))
                .revoked(false)
                .build();
        refreshTokenRepository.save(token);
        return raw;
    }

    /** Validates the raw refresh token, revokes it, and issues a new one (rotation). */
    public RotationResult rotate(String rawToken) {
        String hash = HashUtils.sha256(rawToken);
        RefreshToken existing = refreshTokenRepository.findByTokenHashAndRevokedFalse(hash)
                .orElseThrow(() -> new com.elearny.exception.AccessDeniedCustomException("Invalid or expired refresh token"));
        if (existing.getExpiresAt().isBefore(LocalDateTime.now())) {
            existing.setRevoked(true);
            refreshTokenRepository.save(existing);
            throw new com.elearny.exception.AccessDeniedCustomException("Refresh token expired");
        }
        existing.setRevoked(true);
        refreshTokenRepository.save(existing);
        String newRaw = issue(existing.getUser());
        return new RotationResult(existing.getUser(), newRaw);
    }

    public void revokeAllForUser(User user) {
        refreshTokenRepository.revokeAllForUser(user);
    }

    public record RotationResult(User user, String newRefreshToken) {}
}
