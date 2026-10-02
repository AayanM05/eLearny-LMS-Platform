package com.elearny.backend.course.service;

import com.elearny.backend.auth.repository.UserRepository;
import com.elearny.backend.course.dto.CourseDetailResponse;
import com.elearny.backend.course.dto.CourseResponse;
import com.elearny.backend.course.dto.CreateLessonRequest;
import com.elearny.backend.course.dto.CreateSectionRequest;
import com.elearny.backend.course.dto.LessonResponse;
import com.elearny.backend.course.dto.SaveCourseRequest;
import com.elearny.backend.course.dto.SectionResponse;
import com.elearny.backend.course.entity.Course;
import com.elearny.backend.course.entity.CourseSection;
import com.elearny.backend.course.entity.CourseStatus;
import com.elearny.backend.course.entity.DifficultyLevel;
import com.elearny.backend.course.entity.Lesson;
import com.elearny.backend.course.entity.LessonContentType;
import com.elearny.backend.course.exception.CourseNotFoundException;
import com.elearny.backend.course.exception.CourseNotPublishableException;
import com.elearny.backend.course.exception.NotCourseOwnerException;
import com.elearny.backend.course.repository.CourseRepository;
import com.elearny.backend.course.repository.CourseSectionRepository;
import com.elearny.backend.course.repository.LessonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class CourseService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final CourseRepository courseRepository;
    private final CourseSectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    public CourseService(
            CourseRepository courseRepository,
            CourseSectionRepository sectionRepository,
            LessonRepository lessonRepository,
            UserRepository userRepository
    ) {
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CourseResponse createCourse(UUID instructorId, SaveCourseRequest request) {
        Course course = new Course();
        course.setInstructor(userRepository.getReferenceById(instructorId));
        applyFields(course, request);
        course.setSlug(generateUniqueSlug(request.title()));
        course.setStatus(CourseStatus.DRAFT);
        course.setVersion(1);

        return toCourseResponse(courseRepository.save(course));
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> listByInstructor(UUID instructorId) {
        return courseRepository.findAllByInstructorIdOrderByCreatedAtDesc(instructorId)
                .stream().map(this::toCourseResponse).toList();
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getDetail(UUID instructorId, UUID courseId) {
        Course course = findOwnedCourse(instructorId, courseId);
        return toDetailResponse(course);
    }

    @Transactional
    public CourseResponse updateCourse(UUID instructorId, UUID courseId, SaveCourseRequest request) {
        Course course = findOwnedCourse(instructorId, courseId);
        applyFields(course, request);
        // Re-slugging on every title edit would break any already-shared
        // course links — the slug is set once at creation and never
        // changes automatically. (No rename-slug endpoint exists in V1.)
        course.setVersion(course.getVersion() + 1);
        return toCourseResponse(courseRepository.save(course));
    }

    @Transactional
    public CourseResponse publish(UUID instructorId, UUID courseId) {
        Course course = findOwnedCourse(instructorId, courseId);

        List<CourseSection> sections = sectionRepository.findAllByCourseIdOrderByPositionAsc(courseId);
        if (sections.isEmpty()) {
            throw new CourseNotPublishableException("add at least one section first");
        }
        boolean hasAnyLesson = sections.stream()
                .anyMatch(s -> !lessonRepository.findAllBySectionIdOrderByPositionAsc(s.getId()).isEmpty());
        if (!hasAnyLesson) {
            throw new CourseNotPublishableException("add at least one lesson first");
        }

        course.setStatus(CourseStatus.PUBLISHED);
        return toCourseResponse(courseRepository.save(course));
    }

    @Transactional
    public SectionResponse addSection(UUID instructorId, UUID courseId, CreateSectionRequest request) {
        Course course = findOwnedCourse(instructorId, courseId);

        CourseSection section = new CourseSection();
        section.setCourse(course);
        section.setTitle(request.title());
        section.setPosition(request.position());

        CourseSection saved = sectionRepository.save(section);
        return new SectionResponse(saved.getId(), saved.getTitle(), saved.getPosition(), List.of());
    }

    @Transactional
    public LessonResponse addLesson(UUID instructorId, UUID courseId, UUID sectionId, CreateLessonRequest request) {
        // Ownership is checked via the course, not the section directly —
        // findOwnedCourse throws NotCourseOwnerException if the instructor
        // doesn't own courseId, which also implicitly protects every
        // section/lesson under it without a separate ownership table walk
        // per section.
        findOwnedCourse(instructorId, courseId);

        CourseSection section = sectionRepository.findById(sectionId)
                .filter(s -> s.getCourse().getId().equals(courseId))
                .orElseThrow(CourseNotFoundException::new);

        LessonContentType contentType;
        try {
            contentType = LessonContentType.valueOf(request.contentType().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new CourseNotPublishableException("invalid content type '" + request.contentType() + "'");
        }

        Lesson lesson = new Lesson();
        lesson.setSection(section);
        lesson.setTitle(request.title());
        lesson.setContentType(contentType);
        lesson.setVideoUrl(request.videoUrl());
        lesson.setArticleContent(request.articleContent());
        lesson.setResourceUrl(request.resourceUrl());
        lesson.setPosition(request.position());
        lesson.setDripDelayDays(request.dripDelayDays());

        Lesson saved = lessonRepository.save(lesson);
        return toLessonResponse(saved);
    }

    private Course findOwnedCourse(UUID instructorId, UUID courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFoundException::new);
        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new NotCourseOwnerException();
        }
        return course;
    }

    private void applyFields(Course course, SaveCourseRequest request) {
        course.setTitle(request.title());
        course.setTagline(request.tagline());
        course.setCategory(request.category());
        if (request.difficultyLevel() != null && !request.difficultyLevel().isBlank()) {
            course.setDifficultyLevel(DifficultyLevel.valueOf(request.difficultyLevel().toUpperCase(Locale.ROOT)));
        }
        course.setPriceCents(request.priceCents());
        course.setThumbnailUrl(request.thumbnailUrl());
        course.setPromoVideoUrl(request.promoVideoUrl());
    }

    private String generateUniqueSlug(String title) {
        String base = title.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        if (base.isBlank()) {
            base = "course";
        }

        String candidate = base;
        while (courseRepository.existsBySlug(candidate)) {
            candidate = base + "-" + (1000 + RANDOM.nextInt(9000)); // random 4-digit suffix, not a counter — avoids a race between concurrent creations checking the same counter value
        }
        return candidate;
    }

    private CourseResponse toCourseResponse(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getTitle(),
                course.getSlug(),
                course.getTagline(),
                course.getCategory(),
                course.getDifficultyLevel() != null ? course.getDifficultyLevel().name() : null,
                course.getPriceCents(),
                course.getThumbnailUrl(),
                course.getPromoVideoUrl(),
                course.getStatus().name(),
                course.getVersion()
        );
    }

    private CourseDetailResponse toDetailResponse(Course course) {
        List<SectionResponse> sections = sectionRepository.findAllByCourseIdOrderByPositionAsc(course.getId())
                .stream()
                .map(section -> {
                    List<LessonResponse> lessons = lessonRepository.findAllBySectionIdOrderByPositionAsc(section.getId())
                            .stream().map(this::toLessonResponse).toList();
                    return new SectionResponse(section.getId(), section.getTitle(), section.getPosition(), lessons);
                })
                .toList();

        return new CourseDetailResponse(
                course.getId(),
                course.getTitle(),
                course.getSlug(),
                course.getTagline(),
                course.getCategory(),
                course.getDifficultyLevel() != null ? course.getDifficultyLevel().name() : null,
                course.getPriceCents(),
                course.getThumbnailUrl(),
                course.getPromoVideoUrl(),
                course.getStatus().name(),
                course.getVersion(),
                sections
        );
    }

    private LessonResponse toLessonResponse(Lesson lesson) {
        return new LessonResponse(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getContentType().name(),
                lesson.getVideoUrl(),
                lesson.getArticleContent(),
                lesson.getResourceUrl(),
                lesson.getPosition(),
                lesson.getDripDelayDays()
        );
    }
}
