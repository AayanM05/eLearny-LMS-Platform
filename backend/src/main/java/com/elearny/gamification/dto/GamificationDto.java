package com.elearny.gamification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GamificationDto {
    private UUID userId;
    private int xp;
    private int streakCount;
    private LocalDate lastActiveDate;
    private List<String> badges;
}
