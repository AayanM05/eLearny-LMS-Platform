package com.elearny.controller;

import com.elearny.dto.request.TaInviteRequest;
import com.elearny.entity.TaAssignment;
import com.elearny.service.TaService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Teaching Assistants", description = "FR39/FR40")
public class TaController {

    private final TaService taService;

    @PostMapping("/api/courses/{courseId}/ta-invitations")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<TaAssignment> invite(@PathVariable Long courseId, @Valid @RequestBody TaInviteRequest req) {
        return ResponseEntity.ok(taService.invite(SecurityUtils.currentUser(), courseId, req));
    }

    @PostMapping("/api/ta-invitations/{assignmentId}/accept")
    @PreAuthorize("hasRole('TEACHING_ASSISTANT')")
    public ResponseEntity<Void> accept(@PathVariable Long assignmentId) {
        taService.accept(SecurityUtils.currentUser(), assignmentId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/ta-invitations/{assignmentId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<Void> revoke(@PathVariable Long assignmentId) {
        taService.revoke(SecurityUtils.currentUser(), assignmentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/courses/{courseId}/ta-invitations")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<java.util.List<TaAssignment>> list(@PathVariable Long courseId) {
        return ResponseEntity.ok(taService.forCourse(SecurityUtils.currentUser(), courseId));
    }

    @GetMapping("/api/ta-invitations/mine")
    @PreAuthorize("hasRole('TEACHING_ASSISTANT')")
    public ResponseEntity<java.util.List<TaAssignment>> mine() {
        return ResponseEntity.ok(taService.myInvitations(SecurityUtils.currentUser()));
    }
}
