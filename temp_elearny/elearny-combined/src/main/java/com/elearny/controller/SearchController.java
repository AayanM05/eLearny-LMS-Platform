package com.elearny.controller;

import com.elearny.dto.response.CourseResponse;
import com.elearny.dto.response.UserSummary;
import com.elearny.service.SearchService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Global Search", description = "FR67/FR68")
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> courses(@RequestParam String q) {
        return ResponseEntity.ok(searchService.searchCourses(q));
    }

    @GetMapping("/instructors")
    public ResponseEntity<List<UserSummary>> instructors(@RequestParam String q) {
        return ResponseEntity.ok(searchService.searchInstructors(q));
    }
}
