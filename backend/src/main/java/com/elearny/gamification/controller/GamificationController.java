package com.elearny.gamification.controller;

import com.elearny.gamification.dto.GamificationDto;
import com.elearny.gamification.dto.LeaderboardEntryDto;
import com.elearny.gamification.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/gamification")
@RequiredArgsConstructor
public class GamificationController {

    private final GamificationService gamificationService;

    @GetMapping("/me")
    public ResponseEntity<GamificationDto> getMyGamificationProfile(@AuthenticationPrincipal String userId) {
        GamificationDto dto = gamificationService.getUserGamification(UUID.fromString(userId));
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/award-xp")
    public ResponseEntity<GamificationDto> awardXp(
            @AuthenticationPrincipal String userId,
            @RequestParam int amount) {
        GamificationDto dto = gamificationService.awardXp(UUID.fromString(userId), amount);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard() {
        List<LeaderboardEntryDto> leaderboard = gamificationService.getLeaderboard();
        return ResponseEntity.ok(leaderboard);
    }
}
