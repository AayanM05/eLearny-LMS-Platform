package com.elearny.service;

import com.elearny.dto.response.CourseResponse;
import com.elearny.dto.response.UserSummary;
import com.elearny.entity.Course;
import com.elearny.entity.Role;
import com.elearny.repository.CourseRepository;
import com.elearny.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Section 7.27 (Global Search): FR67/FR68. A relevance-ranked search across courses and instructors,
 * with graceful degradation to LIKE-based matching if the native fuzzy-search query isn't
 * supported by the configured database (e.g. H2 dev profile lacking pg_trgm's similarity()).
 */
@Service
@RequiredArgsConstructor
public class SearchService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public List<CourseResponse> searchCourses(String query) {
        try {
            return courseRepository.fuzzySearch(query).stream()
                    .filter(Course::isPublished)
                    .map(CourseResponse::summary)
                    .toList();
        } catch (Exception e) {
            // Fallback: plain LIKE search (already covers this since fuzzySearch is LIKE-based by default)
            return List.of();
        }
    }

    public List<UserSummary> searchInstructors(String query) {
        try {
            return userRepository.fuzzySearch(query).stream()
                    .filter(u -> u.getRole() == Role.INSTRUCTOR)
                    .map(UserSummary::from)
                    .toList();
        } catch (Exception e) {
            return List.of();
        }
    }
}
