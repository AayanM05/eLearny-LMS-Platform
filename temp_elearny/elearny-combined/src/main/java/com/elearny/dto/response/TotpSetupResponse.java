package com.elearny.dto.response;

public record TotpSetupResponse(String secret, String qrCodeDataUri) {}
