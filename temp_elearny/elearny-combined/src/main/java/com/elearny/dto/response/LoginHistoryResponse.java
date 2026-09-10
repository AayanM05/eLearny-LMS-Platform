package com.elearny.dto.response;

import java.time.LocalDateTime;

public record LoginHistoryResponse(String ipAddress, String deviceInfo, LocalDateTime loggedInAt) {}
