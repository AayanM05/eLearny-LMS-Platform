package com.elearny.instructor.controller;

import com.elearny.instructor.dto.InstructorApplicationResponse;
import com.elearny.instructor.dto.ReviewApplicationRequest;
import com.elearny.instructor.entity.ApplicationStatus;
import com.elearny.instructor.service.InstructorApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/instructor-applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminInstructorController {

    private final InstructorApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<InstructorApplicationResponse>> getApplications(
            @RequestParam(required = false) ApplicationStatus status) {
        List<InstructorApplicationResponse> response = applicationService.getApplicationsByStatus(status);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<InstructorApplicationResponse> reviewApplication(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewApplicationRequest request) {
        InstructorApplicationResponse response = applicationService.reviewApplication(id, request);
        return ResponseEntity.ok(response);
    }
}
