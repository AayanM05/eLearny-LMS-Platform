package com.elearny.controller;

import com.elearny.dto.ApiResponse;
import com.elearny.dto.ApplicationReviewRequest;
import com.elearny.dto.InstructorApplicationResponse;
import com.elearny.service.AdminInstructorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/instructor-applications")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminInstructorController {

    private final AdminInstructorService adminInstructorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InstructorApplicationResponse>>> getApplications(
            @RequestParam(required = false) String status) {
        List<InstructorApplicationResponse> response = adminInstructorService.getApplications(status);
        return ResponseEntity.ok(ApiResponse.success(response, "Instructor applications retrieved successfully"));
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<ApiResponse<InstructorApplicationResponse>> reviewApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ApplicationReviewRequest request) {
        InstructorApplicationResponse response = adminInstructorService.reviewApplication(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Application reviewed successfully"));
    }
}
