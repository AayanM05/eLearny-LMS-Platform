package com.elearny.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Issues and validates short-lived JWT access tokens (Section 7.1, FR3).
 * Refresh tokens are opaque random strings stored hashed in the DB (see RefreshTokenService),
 * not JWTs — this lets us revoke/rotate them server-side (rotation, "logout everywhere").
 */
@Component
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secretKeyBase64;

    @Value("${app.jwt.access-token-expiry-minutes:15}")
    private long accessTokenExpiryMinutes;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKeyBase64));
    }

    public String generateAccessToken(Long userId, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("uid", userId);
        claims.put("role", role);
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenExpiryMinutes * 60 * 1000);
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(now)
                .expiration(expiry)
                .id(UUID.randomUUID().toString())
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
    }

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        return parseClaims(token).get("uid", Integer.class).longValue();
    }

    public boolean isTokenValid(String token, String expectedEmail) {
        try {
            Claims claims = parseClaims(token);
            return claims.getSubject().equals(expectedEmail) && claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    /** Generates a cryptographically random opaque refresh token (raw value shown to client once). */
    public String generateOpaqueRefreshToken() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
