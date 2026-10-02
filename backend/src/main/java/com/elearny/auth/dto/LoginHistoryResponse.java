package com.elearny.auth.dto;

import java.time.LocalDateTime;

public record LoginHistoryResponse(String ipAddress, String deviceInfo, LocalDateTime loggedInAt) {}
