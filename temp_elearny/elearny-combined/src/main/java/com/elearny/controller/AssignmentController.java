package com.elearny.controller;

import com.elearny.dto.request.AssignmentCreateRequest;
import com.elearny.dto.request.AssignmentGradeRequest;
import com.elearny.dto.request.AssignmentSubmitRequest;
import com.elearny.entity.Assignment;
import com.elearny.entity.AssignmentSubmission;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.AssignmentRepository;
import com.elearny.service.AssignmentService;
import com.elearny.service.CourseContentService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Assignments", description = "FR16-FR18")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final AssignmentRepository assignmentRepository;
    private final CourseContentService courseContentService;

    @PostMapping("/api/subsections/{subsectionId}/assignment")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<Assignment> create(@PathVariable Long subsectionId, @Valid @RequestBody AssignmentCreateRequest req) {
        return ResponseEntity.ok(assignmentService.createAssignment(SecurityUtils.currentUser(), subsectionId, req));
    }

    /** Resolves "this sub-section is an ASSIGNMENT" into the assignment (instructions, due date) to render. */
    @GetMapping("/api/subsections/{subsectionId}/assignment")
    public ResponseEntity<Assignment> getBySubsection(@PathVariable Long subsectionId) {
        var subsection = courseContentService.findSubsection(subsectionId);
        Assignment assignment = assignmentRepository.findBySubsection(subsection)
                .orElseThrow(() -> new ResourceNotFoundException("No assignment configured for this sub-section yet."));
        return ResponseEntity.ok(assignment);
    }

    @PostMapping("/api/assignments/{assignmentId}/submissions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AssignmentSubmission> submit(@PathVariable Long assignmentId, @Valid @RequestBody AssignmentSubmitRequest req) {
        return ResponseEntity.ok(assignmentService.submit(SecurityUtils.currentUser(), assignmentId, req));
    }

    @PostMapping("/api/assignment-submissions/{submissionId}/grade")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')")
    public ResponseEntity<AssignmentSubmission> grade(@PathVariable Long submissionId, @Valid @RequestBody AssignmentGradeRequest req) {
        return ResponseEntity.ok(assignmentService.grade(SecurityUtils.currentUser(), submissionId, req));
    }

    @GetMapping("/api/assignments/{assignmentId}/submissions")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')")
    public ResponseEntity<java.util.List<com.elearny.dto.response.AssignmentSubmissionResponse>> submissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentService.listSubmissions(SecurityUtils.currentUser(), assignmentId));
    }
}
