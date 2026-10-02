package com.elearny.livesession.dto;

import java.time.LocalDateTime;

public record LiveSessionSlotResponse(Long id, LocalDateTime startTime, LocalDateTime endTime,
                                       int capacity, int bookedCount, boolean full) {}
