package com.elearny.gamification.service;

import com.elearny.gamification.dto.GamificationDto;
import com.elearny.gamification.dto.LeaderboardEntryDto;
import com.elearny.gamification.entity.UserGamification;
import com.elearny.gamification.repository.UserGamificationRepository;
import com.elearny.user.entity.User;
import com.elearny.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final UserGamificationRepository gamificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public GamificationDto getUserGamification(UUID userId) {
        UserGamification g = getOrCreate(userId);
        return mapToDto(g);
    }

    @Transactional
    public GamificationDto awardXp(UUID userId, int xpAmount) {
        UserGamification g = getOrCreate(userId);
        g.setXp(g.getXp() + xpAmount);

        LocalDate today = LocalDate.now();
        if (g.getLastActiveDate() == null) {
            g.setStreakCount(1);
        } else if (g.getLastActiveDate().equals(today.minusDays(1))) {
            g.setStreakCount(g.getStreakCount() + 1);
        } else if (!g.getLastActiveDate().equals(today)) {
            g.setStreakCount(1);
        }
        g.setLastActiveDate(today);

        // Check badge unlocks
        Set<String> badgeSet = new HashSet<>(Arrays.asList(g.getBadges().split(",")));
        if (g.getStreakCount() >= 3) badgeSet.add("3_DAY_STREAK");
        if (g.getStreakCount() >= 7) badgeSet.add("7_DAY_STREAK");
        if (g.getXp() >= 500) badgeSet.add("500_XP_ACHIEVER");
        if (g.getXp() >= 2000) badgeSet.add("LMS_MASTER");

        g.setBadges(String.join(",", badgeSet));

        UserGamification saved = gamificationRepository.save(g);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<LeaderboardEntryDto> getLeaderboard() {
        List<UserGamification> topUsers = gamificationRepository.findTop20ByOrderByXpDesc();
        List<LeaderboardEntryDto> leaderboard = new ArrayList<>();

        for (int i = 0; i < topUsers.size(); i++) {
            UserGamification ug = topUsers.get(i);
            User u = ug.getUser();
            String[] bArray = ug.getBadges().split(",");
            String primaryBadge = bArray.length > 0 ? bArray[bArray.length - 1] : "BEGINNER";

            leaderboard.add(LeaderboardEntryDto.builder()
                    .rank(i + 1)
                    .userId(u.getId())
                    .fullName(u.getFullName())
                    .xp(ug.getXp())
                    .streakCount(ug.getStreakCount())
                    .primaryBadge(primaryBadge)
                    .build());
        }

        return leaderboard;
    }

    private UserGamification getOrCreate(UUID userId) {
        return gamificationRepository.findById(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

                    UserGamification newGamification = UserGamification.builder()
                            .user(user)
                            .xp(100) // 100 XP welcome bonus
                            .streakCount(1)
                            .lastActiveDate(LocalDate.now())
                            .badges("BEGINNER")
                            .build();

                    return gamificationRepository.save(newGamification);
                });
    }

    private GamificationDto mapToDto(UserGamification g) {
        List<String> badgeList = Arrays.asList(g.getBadges().split(","));
        return GamificationDto.builder()
                .userId(g.getUserId())
                .xp(g.getXp())
                .streakCount(g.getStreakCount())
                .lastActiveDate(g.getLastActiveDate())
                .badges(badgeList)
                .build();
    }
}
