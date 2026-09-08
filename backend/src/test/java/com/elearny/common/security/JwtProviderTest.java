package com.elearny.common.security;

import com.elearny.user.entity.Role;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class JwtProviderTest {

    private JwtProvider jwtProvider;
    private final String secret = "testSecretKeyForDevelopmentPhaseMustBeAtLeast32BytesLong!";

    @BeforeEach
    public void setUp() {
        jwtProvider = new JwtProvider(secret, 900000, 604800000, 300000);
    }

    @Test
    public void shouldGenerateAndValidateAccessToken() {
        UUID userId = UUID.randomUUID();
        String email = "test@elearny.com";
        Role role = Role.STUDENT;

        String token = jwtProvider.generateAccessToken(userId, email, role);

        assertNotNull(token);
        assertTrue(jwtProvider.validateToken(token));

        Claims claims = jwtProvider.getClaimsFromToken(token);
        assertEquals(userId.toString(), claims.getSubject());
        assertEquals(email, claims.get("email"));
        assertEquals("STUDENT", claims.get("role"));
        assertEquals("ACCESS", claims.get("type"));
    }

    @Test
    public void shouldGenerateRefreshToken() {
        UUID userId = UUID.randomUUID();

        String token = jwtProvider.generateRefreshToken(userId);

        assertNotNull(token);
        assertTrue(jwtProvider.validateToken(token));

        Claims claims = jwtProvider.getClaimsFromToken(token);
        assertEquals(userId.toString(), claims.getSubject());
        assertEquals("REFRESH", claims.get("type"));
    }
}
