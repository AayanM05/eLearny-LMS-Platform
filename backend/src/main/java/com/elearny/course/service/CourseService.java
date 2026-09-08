package com.elearny.course.service;

import com.elearny.common.exception.ResourceNotFoundException;
import com.elearny.course.dto.*;
import com.elearny.course.entity.*;
import com.elearny.course.repository.CourseRepository;
import com.elearny.course.repository.LessonRepository;
import com.elearny.course.repository.SectionRepository;
import com.elearny.user.entity.User;
import com.elearny.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    @Transactional
    public CourseResponse createCourse(UUID instructorId, CreateCourseRequest request) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id: " + instructorId));

        String baseSlug = generateSlug(request.getTitle());
        String slug = baseSlug;
        int count = 1;
        while (courseRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + count++;
        }

        Course course = Course.builder()
                .instructor(instructor)
                .title(request.getTitle())
                .slug(slug)
                .subtitle(request.getSubtitle())
                .description(request.getDescription())
                .category(request.getCategory() != null ? request.getCategory() : "Engineering")
                .level(request.getLevel() != null ? request.getLevel() : CourseLevel.BEGINNER)
                .language(request.getLanguage() != null ? request.getLanguage() : "English")
                .price(request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO)
                .thumbnailUrl(request.getThumbnailUrl())
                .status(CourseStatus.DRAFT)
                .build();

        Course saved = courseRepository.save(course);
        return mapToCourseResponse(saved);
    }

    @Transactional
    public SectionResponse addSection(UUID courseId, UUID instructorId, CreateSectionRequest request) {
        Course course = getCourseAndValidateInstructor(courseId, instructorId);

        Section section = Section.builder()
                .course(course)
                .title(request.getTitle())
                .orderIndex(request.getOrderIndex())
                .build();

        Section saved = sectionRepository.save(section);
        return mapToSectionResponse(saved);
    }

    @Transactional
    public LessonResponse addLesson(UUID sectionId, UUID instructorId, CreateLessonRequest request) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));

        getCourseAndValidateInstructor(section.getCourse().getId(), instructorId);

        Lesson lesson = Lesson.builder()
                .section(section)
                .title(request.getTitle())
                .lessonType(request.getLessonType() != null ? request.getLessonType() : LessonType.VIDEO)
                .contentUrl(request.getContentUrl())
                .articleContent(request.getArticleContent())
                .durationSeconds(request.getDurationSeconds())
                .orderIndex(request.getOrderIndex())
                .preview(request.isPreview())
                .build();

        Lesson saved = lessonRepository.save(lesson);
        return mapToLessonResponse(saved);
    }

    @Transactional
    public CourseResponse updateCourseStatus(UUID courseId, UUID instructorId, CourseStatus status) {
        Course course = getCourseAndValidateInstructor(courseId, instructorId);
        course.setStatus(status);
        Course saved = courseRepository.save(course);
        return mapToCourseResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesByInstructor(UUID instructorId) {
        return courseRepository.findByInstructorIdOrderByCreatedAtDesc(instructorId)
                .stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getPublishedCourses(String category) {
        List<Course> courses = (category != null && !category.isBlank())
                ? courseRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, CourseStatus.PUBLISHED)
                : courseRepository.findByStatusOrderByCreatedAtDesc(CourseStatus.PUBLISHED);

        return courses.stream().map(this::mapToCourseResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseBySlug(String slug) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with slug: " + slug));
        return mapToCourseResponse(course);
    }

    private Course getCourseAndValidateInstructor(UUID courseId, UUID instructorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new IllegalStateException("You are not authorized to modify this course");
        }
        return course;
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }

    private CourseResponse mapToCourseResponse(Course course) {
        List<SectionResponse> sectionResponses = course.getSections() != null
                ? course.getSections().stream().map(this::mapToSectionResponse).collect(Collectors.toList())
                : List.of();

        return CourseResponse.builder()
                .id(course.getId())
                .instructorId(course.getInstructor().getId())
                .instructorName(course.getInstructor().getFullName())
                .title(course.getTitle())
                .slug(course.getSlug())
                .subtitle(course.getSubtitle())
                .description(course.getDescription())
                .category(course.getCategory())
                .level(course.getLevel())
                .language(course.getLanguage())
                .price(course.getPrice())
                .thumbnailUrl(course.getThumbnailUrl())
                .status(course.getStatus())
                .dripEnabled(course.isDripEnabled())
                .sections(sectionResponses)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }

    private SectionResponse mapToSectionResponse(Section section) {
        List<LessonResponse> lessonResponses = section.getLessons() != null
                ? section.getLessons().stream().map(this::mapToLessonResponse).collect(Collectors.toList())
                : List.of();

        return SectionResponse.builder()
                .id(section.getId())
                .courseId(section.getCourse().getId())
                .title(section.getTitle())
                .orderIndex(section.getOrderIndex())
                .lessons(lessonResponses)
                .createdAt(section.getCreatedAt())
                .updatedAt(section.getUpdatedAt())
                .build();
    }

    private LessonResponse mapToLessonResponse(Lesson lesson) {
        return LessonResponse.builder()
                .id(lesson.getId())
                .sectionId(lesson.getSection().getId())
                .title(lesson.getTitle())
                .lessonType(lesson.getLessonType())
                .contentUrl(lesson.getContentUrl())
                .articleContent(lesson.getArticleContent())
                .durationSeconds(lesson.getDurationSeconds())
                .orderIndex(lesson.getOrderIndex())
                .preview(lesson.isPreview())
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}
