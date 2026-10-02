package com.elearny.livesession;

import com.elearny.common.util.SecurityUtils;
import com.elearny.leave.InstructorLeave;
import com.elearny.livesession.dto.InstructorUnavailabilityRequest;








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
