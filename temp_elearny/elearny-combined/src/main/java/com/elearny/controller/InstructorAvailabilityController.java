package com.elearny.controller;

import com.elearny.dto.request.InstructorUnavailabilityRequest;
import com.elearny.entity.InstructorLeave;
import com.elearny.service.InstructorAvailabilityService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/instructor-availability")
@RequiredArgsConstructor
@Tag(name = "Instructor Availability", description = "FR57")
@PreAuthorize("hasRole('INSTRUCTOR')")
public class InstructorAvailabilityController {

    private final InstructorAvailabilityService availabilityService;

    @PostMapping
    public ResponseEntity<InstructorLeave> markUnavailable(@Valid @RequestBody InstructorUnavailabilityRequest req) {
        return ResponseEntity.ok(availabilityService.markUnavailable(SecurityUtils.currentUser(), req));
    }

    @DeleteMapping("/{leaveId}")
    public ResponseEntity<Void> cancel(@PathVariable Long leaveId) {
        availabilityService.cancel(SecurityUtils.currentUser(), leaveId);
        return ResponseEntity.ok().build();
    }
}
