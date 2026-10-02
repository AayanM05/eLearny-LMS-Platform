package com.elearny.enrollment;

import com.elearny.common.util.SecurityUtils;
import com.elearny.course.Course;
import com.elearny.course.CourseContentService;
import com.elearny.course.CourseService;
import com.elearny.course.Subsection;
import com.elearny.enrollment.dto.ProgressResponse;








import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Progress", description = "FR22-FR24")
public class ProgressController {

    private final ProgressService progressService;
    private final CourseContentService courseContentService;
    private final CourseService courseService;

    @PostMapping("/api/subsections/{subsectionId}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> markComplete(@PathVariable Long subsectionId,
                                              @RequestParam(required = false) Integer lastPositionSeconds) {
        Subsection subsection = courseContentService.findSubsection(subsectionId);
        progressService.markComplete(SecurityUtils.currentUser(), subsection, lastPositionSeconds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/courses/{courseId}/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ProgressResponse> getProgress(@PathVariable Long courseId) {
        Course course = courseService.findEntity(courseId);
        return ResponseEntity.ok(progressService.getProgress(SecurityUtils.currentUser(), course));
    }
}
