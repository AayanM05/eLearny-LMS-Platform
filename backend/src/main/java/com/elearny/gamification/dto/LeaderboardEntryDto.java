package com.elearny.gamification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDto {
    private int rank;
    private UUID userId;
    private String fullName;
    private int xp;
    private int streakCount;
    private String primaryBadge;
}
