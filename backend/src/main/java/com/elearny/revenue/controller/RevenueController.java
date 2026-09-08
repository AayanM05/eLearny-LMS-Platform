package com.elearny.revenue.controller;

import com.elearny.revenue.dto.InstructorEarningsDto;
import com.elearny.revenue.dto.RevenueAnalyticsDto;
import com.elearny.revenue.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class RevenueController {

    private final RevenueService revenueService;

    @GetMapping("/admin/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RevenueAnalyticsDto> getPlatformRevenueAnalytics() {
        RevenueAnalyticsDto analytics = revenueService.getPlatformRevenueAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/instructor/earnings")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<InstructorEarningsDto> getInstructorEarnings(@AuthenticationPrincipal String userId) {
        InstructorEarningsDto earnings = revenueService.getInstructorEarnings(UUID.fromString(userId));
        return ResponseEntity.ok(earnings);
    }
}
