package com.elearny.backend.instructor.controller;

import com.elearny.backend.auth.dto.MessageResponse;
import com.elearny.backend.instructor.dto.SetupAccountRequest;
import com.elearny.backend.instructor.service.InstructorApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public/unauthenticated by design — the applicant has no account they can
 * log into yet at this point. Security comes from requiring BOTH the
 * setup token AND the OTP, not from requiring auth (see prd.md §3.26).
 */
@RestController
@RequestMapping("/api/v1/instructor/setup-account")
public class InstructorSetupController {

    private final InstructorApplicationService applicationService;

    public InstructorSetupController(InstructorApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public MessageResponse setupAccount(@Valid @RequestBody SetupAccountRequest request) {
        applicationService.setupAccount(request);
        return new MessageResponse("Your instructor account is ready. You can now log in.");
    }
}
