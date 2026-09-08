package com.elearny.instructor.controller;

import com.elearny.instructor.dto.ApplyInstructorRequest;
import com.elearny.instructor.dto.InstructorApplicationResponse;
import com.elearny.instructor.service.InstructorApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/instructor/applications")
@RequiredArgsConstructor
public class InstructorApplicationController {

    private final InstructorApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<InstructorApplicationResponse> submitApplication(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody ApplyInstructorRequest request) {
        InstructorApplicationResponse response = applicationService.submitApplication(UUID.fromString(userId), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-status")
    public ResponseEntity<InstructorApplicationResponse> getMyApplicationStatus(
            @AuthenticationPrincipal String userId) {
        InstructorApplicationResponse response = applicationService.getApplicationStatusForUser(UUID.fromString(userId));
        return ResponseEntity.ok(response);
    }
}

