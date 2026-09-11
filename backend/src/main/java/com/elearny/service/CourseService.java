package com.elearny.service;

import com.elearny.dto.*;
import com.elearny.entity.*;
import com.elearny.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseSectionRepository sectionRepository;
    private final CourseLessonRepository lessonRepository;
    private final UserRepository userRepository;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Transactional
    public CourseResponse createCourse(String instructorUsername, CourseCreateRequest request) {
        User instructor = userRepository.findByUsername(instructorUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + instructorUsername));

        String slug = generateSlug(request.getTitle());

        Course course = Course.builder()
                .instructor(instructor)
                .title(request.getTitle())
                .slug(slug)
                .subtitle(request.getSubtitle())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .promoVideoUrl(request.getPromoVideoUrl())
                .price(request.getPrice())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .level(request.getLevel() != null ? request.getLevel() : "BEGINNER")
                .category(request.getCategory())
                .tags(request.getTags())
                .status("DRAFT")
                .build();

        Course saved = courseRepository.save(course);
        return mapToCourseResponse(saved);
    }

    @Transactional
    public CourseSectionResponse addSection(Long courseId, String instructorUsername, CourseSectionRequest request) {
        Course course = getCourseIfOwner(courseId, instructorUsername);

        int nextOrder = sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId).size();

        CourseSection section = CourseSection.builder()
                .course(course)
                .title(request.getTitle())
                .description(request.getDescription())
                .orderIndex(request.getOrderIndex() > 0 ? request.getOrderIndex() : nextOrder)
                .build();

        CourseSection saved = sectionRepository.save(section);
        return mapToSectionResponse(saved);
    }

    @Transactional
    public CourseLessonResponse addLesson(Long sectionId, String instructorUsername, CourseLessonRequest request) {
        CourseSection section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new IllegalArgumentException("Section not found: " + sectionId));

        getCourseIfOwner(section.getCourse().getId(), instructorUsername);

        int nextOrder = lessonRepository.findBySectionIdOrderByOrderIndexAsc(sectionId).size();

        CourseLesson lesson = CourseLesson.builder()
                .section(section)
                .title(request.getTitle())
                .lessonType(request.getLessonType() != null ? request.getLessonType() : "VIDEO")
                .contentUrl(request.getContentUrl())
                .textContent(request.getTextContent())
                .durationSeconds(request.getDurationSeconds())
                .isFreePreview(request.isFreePreview())
                .orderIndex(request.getOrderIndex() > 0 ? request.getOrderIndex() : nextOrder)
                .build();

        CourseLesson saved = lessonRepository.save(lesson);
        return mapToLessonResponse(saved);
    }

    @Transactional
    public CourseResponse publishCourse(Long courseId, String instructorUsername) {
        Course course = getCourseIfOwner(courseId, instructorUsername);

        if (course.getSections().isEmpty()) {
            throw new IllegalStateException("Course must have at least one section before publishing");
        }

        course.setStatus("PUBLISHED");
        Course saved = courseRepository.save(course);
        return mapToCourseResponse(saved);
    }

    public List<CourseResponse> getMyCourses(String instructorUsername) {
        User instructor = userRepository.findByUsername(instructorUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + instructorUsername));

        return courseRepository.findByInstructorId(instructor.getId()).stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    public List<CourseResponse> getPublishedCourses() {
        return courseRepository.findByStatus("PUBLISHED").stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse getCourseBySlug(String slug) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with slug: " + slug));
        return mapToCourseResponse(course);
    }

    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + id));
        return mapToCourseResponse(course);
    }

    private Course getCourseIfOwner(Long courseId, String username) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));
        if (!course.getInstructor().getUsername().equals(username)) {
            throw new SecurityException("You do not have permission to modify this course");
        }
        return course;
    }

    private String generateSlug(String title) {
        String nowhitespace = WHITESPACE.matcher(title).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("").toLowerCase(Locale.ENGLISH);

        String baseSlug = slug;
        int count = 1;
        while (courseRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count++;
        }
        return slug;
    }

    public CourseResponse mapToCourseResponse(Course course) {
        List<CourseSectionResponse> sectionResponses = course.getSections().stream()
                .map(this::mapToSectionResponse)
                .collect(Collectors.toList());

        return CourseResponse.builder()
                .id(course.getId())
                .instructorId(course.getInstructor().getId())
                .instructorName(course.getInstructor().getFullName())
                .title(course.getTitle())
                .slug(course.getSlug())
                .subtitle(course.getSubtitle())
                .description(course.getDescription())
                .thumbnailUrl(course.getThumbnailUrl())
                .promoVideoUrl(course.getPromoVideoUrl())
                .price(course.getPrice())
                .currency(course.getCurrency())
                .level(course.getLevel())
                .category(course.getCategory())
                .tags(course.getTags())
                .status(course.getStatus())
                .sections(sectionResponses)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }

    public CourseSectionResponse mapToSectionResponse(CourseSection section) {
        List<CourseLessonResponse> lessonResponses = section.getLessons().stream()
                .map(this::mapToLessonResponse)
                .collect(Collectors.toList());

        return CourseSectionResponse.builder()
                .id(section.getId())
                .courseId(section.getCourse().getId())
                .title(section.getTitle())
                .description(section.getDescription())
                .orderIndex(section.getOrderIndex())
                .lessons(lessonResponses)
                .createdAt(section.getCreatedAt())
                .updatedAt(section.getUpdatedAt())
                .build();
    }

    public CourseLessonResponse mapToLessonResponse(CourseLesson lesson) {
        return CourseLessonResponse.builder()
                .id(lesson.getId())
                .sectionId(lesson.getSection().getId())
                .title(lesson.getTitle())
                .lessonType(lesson.getLessonType())
                .contentUrl(lesson.getContentUrl())
                .textContent(lesson.getTextContent())
                .durationSeconds(lesson.getDurationSeconds())
                .isFreePreview(lesson.isFreePreview())
                .orderIndex(lesson.getOrderIndex())
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}
