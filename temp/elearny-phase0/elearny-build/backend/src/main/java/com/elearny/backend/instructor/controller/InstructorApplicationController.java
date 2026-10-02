package com.elearny.backend.instructor.controller;

import com.elearny.backend.instructor.dto.ApplyInstructorRequest;
import com.elearny.backend.instructor.dto.InstructorApplicationResponse;
import com.elearny.backend.instructor.service.InstructorApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/instructor-applications")
public class InstructorApplicationController {

    private final InstructorApplicationService applicationService;

    public InstructorApplicationController(InstructorApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * @AuthenticationPrincipal binds directly to the UUID JwtAuthenticationFilter
     * set as the raw principal — any authenticated user (any role) can apply;
     * there's no role restriction on WHO can apply to become an instructor,
     * only on approving/rejecting.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InstructorApplicationResponse apply(
            @AuthenticationPrincipal UUID applicantUserId,
            @Valid @RequestBody ApplyInstructorRequest request
    ) {
        return applicationService.apply(applicantUserId, request);
    }
}
