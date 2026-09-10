package com.elearny.controller;

import com.elearny.dto.response.DashboardStatsResponse;
import com.elearny.dto.response.UserSummary;
import com.elearny.entity.Role;
import com.elearny.entity.User;
import com.elearny.service.AdminService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Class-level protection comes from SecurityConfig's "/api/admin/**" -> hasRole("ADMIN") rule,
 *  not a per-method @PreAuthorize here — consistent with how this controller was already set up. */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "FR2 + dashboard/reporting + AD7 user management")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/instructor-approvals/pending")
    public ResponseEntity<List<User>> pending() {
        return ResponseEntity.ok(adminService.pendingInstructorApprovals());
    }

    @PostMapping("/instructor-approvals/{instructorId}")
    public ResponseEntity<Void> decide(@PathVariable Long instructorId, @RequestParam boolean approve) {
        adminService.approveInstructor(SecurityUtils.currentUser(), instructorId, approve);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> dashboard() {
        return ResponseEntity.ok(adminService.dashboardStats());
    }

    /** AD7: general-purpose user directory across every role — search + role filter + pagination. */
    @GetMapping("/users")
    public ResponseEntity<Page<UserSummary>> listUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String q,
            Pageable pageable) {
        return ResponseEntity.ok(adminService.listUsers(role, q, pageable));
    }

    /** AD7: deactivate any user, any role. Frontend is expected to confirm before calling this —
     *  see the UI spec's ConfirmDialog pattern for destructive admin actions. */
    @PostMapping("/users/{userId}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long userId, @RequestParam(required = false) String reason) {
        adminService.deactivateUser(SecurityUtils.currentUser(), userId, reason);
        return ResponseEntity.ok().build();
    }

    /** FR34 / UI spec I5: grant or revoke an instructor's platform-wide coupon permission. */
    @PostMapping("/instructors/{instructorId}/coupon-eligibility")
    public ResponseEntity<Void> setCouponEligibility(@PathVariable Long instructorId, @RequestParam boolean eligible) {
        adminService.setCouponEligibility(SecurityUtils.currentUser(), instructorId, eligible);
        return ResponseEntity.ok().build();
    }
}
