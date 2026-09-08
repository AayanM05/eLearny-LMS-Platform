package com.elearny.auth.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TotpServiceTest {

    private TotpService totpService;

    @BeforeEach
    public void setUp() {
        totpService = new TotpService();
    }

    @Test
    public void shouldGenerateSecret() {
        String secret = totpService.generateSecret();
        assertNotNull(secret);
        assertFalse(secret.isEmpty());
    }

    @Test
    public void shouldRejectInvalidCode() {
        String secret = totpService.generateSecret();
        boolean isValid = totpService.verifyCode(secret, "000000");
        assertFalse(isValid);
    }
}
