package com.elearny.auth.dto;

public record TotpSetupResponse(String secret, String qrCodeDataUri) {}
