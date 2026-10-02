package com.elearny.backend.instructor.controller;

import com.elearny.backend.auth.dto.MessageResponse;
import com.elearny.backend.instructor.dto.InstructorApplicationResponse;
import com.elearny.backend.instructor.dto.RejectApplicationRequest;
import com.elearny.backend.instructor.service.InstructorApplicationService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/instructor-applications")
@PreAuthorize("hasRole('ADMIN')")
public class AdminInstructorApplicationController {

    private final InstructorApplicationService applicationService;

    public AdminInstructorApplicationController(InstructorApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public List<InstructorApplicationResponse> listPending() {
        return applicationService.listPending();
    }

    @PostMapping("/{id}/approve")
    public MessageResponse approve(@PathVariable UUID id, @AuthenticationPrincipal UUID adminUserId) {
        applicationService.approve(id, adminUserId);
        return new MessageResponse("Application approved. An invite email has been sent to the applicant.");
    }

    @PostMapping("/{id}/reject")
    public MessageResponse reject(
            @PathVariable UUID id,
            @AuthenticationPrincipal UUID adminUserId,
            @Valid @RequestBody RejectApplicationRequest request
    ) {
        applicationService.reject(id, adminUserId, request);
        return new MessageResponse("Application rejected.");
    }
}
