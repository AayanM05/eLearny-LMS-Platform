package com.elearny.backend.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

/**
 * Issues and validates two token types, distinguished by a "type" claim:
 * "access" (short-lived, sent on every request) and "refresh" (long-lived,
 * only ever sent to /api/v1/auth/refresh to obtain a new access token).
 * Using one secret/service for both, differentiated by claim, rather than
 * two separate signing keys — simpler, and there's no security benefit to
 * separate keys here since both tokens are only ever validated server-side.
 */
@Service
public class JwtService {

    private static final String CLAIM_TYPE = "type";
    private static final String TYPE_ACCESS = "access";
    private static final String TYPE_REFRESH = "refresh";
    private static final String CLAIM_ROLE = "role";

    private final SecretKey signingKey;
    private final Duration accessTokenExpiry;
    private final Duration refreshTokenExpiry;

    public JwtService(
            @Value("${elearny.jwt.secret}") String secret,
            @Value("${elearny.jwt.access-token-expiry-minutes}") long accessMinutes,
            @Value("${elearny.jwt.refresh-token-expiry-days}") long refreshDays
    ) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiry = Duration.ofMinutes(accessMinutes);
        this.refreshTokenExpiry = Duration.ofDays(refreshDays);
    }

    public String generateAccessToken(UUID userId, String role) {
        return buildToken(userId, TYPE_ACCESS, accessTokenExpiry, role);
    }

    public String generateRefreshToken(UUID userId) {
        return buildToken(userId, TYPE_REFRESH, refreshTokenExpiry, null);
    }

    public long getAccessTokenExpirySeconds() {
        return accessTokenExpiry.getSeconds();
    }

    private String buildToken(UUID userId, String type, Duration expiry, String role) {
        Instant now = Instant.now();
        var builder = Jwts.builder()
                .subject(userId.toString())
                .claim(CLAIM_TYPE, type)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expiry)))
                .signWith(signingKey);

        if (role != null) {
            builder.claim(CLAIM_ROLE, role);
        }

        return builder.compact();
    }

    /**
     * @throws JwtException if the token is malformed, expired, or has an
     *                       invalid signature — callers should catch this
     *                       and translate it to a 401, never let it leak
     *                       as a raw 500.
     */
    public Claims parseAndValidate(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isAccessToken(Claims claims) {
        return TYPE_ACCESS.equals(claims.get(CLAIM_TYPE, String.class));
    }

    public boolean isRefreshToken(Claims claims) {
        return TYPE_REFRESH.equals(claims.get(CLAIM_TYPE, String.class));
    }

    public UUID getUserId(Claims claims) {
        return UUID.fromString(claims.getSubject());
    }

    public String getRole(Claims claims) {
        return claims.get(CLAIM_ROLE, String.class);
    }
}
