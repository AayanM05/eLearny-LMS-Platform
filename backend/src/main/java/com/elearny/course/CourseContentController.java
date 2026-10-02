package com.elearny.course;

import com.elearny.common.util.SecurityUtils;
import com.elearny.course.dto.SectionCreateRequest;
import com.elearny.course.dto.SubsectionCreateRequest;








import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Course Content", description = "FR8/FR9 - Sections & Sub-sections")
public class CourseContentController {

    private final CourseContentService courseContentService;

    @PostMapping("/api/courses/{courseId}/sections")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<Section> addSection(@PathVariable Long courseId, @Valid @RequestBody SectionCreateRequest req) {
        return ResponseEntity.ok(courseContentService.addSection(SecurityUtils.currentUser(), courseId, req));
    }

    @PostMapping("/api/sections/{sectionId}/subsections")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<Subsection> addSubsection(@PathVariable Long sectionId, @Valid @RequestBody SubsectionCreateRequest req) {
        return ResponseEntity.ok(courseContentService.addSubsection(SecurityUtils.currentUser(), sectionId, req));
    }
}
