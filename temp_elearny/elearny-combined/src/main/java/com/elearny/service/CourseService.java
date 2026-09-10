package com.elearny.service;

import com.elearny.dto.request.CourseCreateRequest;
import com.elearny.dto.response.CourseResponse;
import com.elearny.dto.response.SectionResponse;
import com.elearny.dto.response.SubsectionResponse;
import com.elearny.entity.*;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.BusinessRuleException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Section 7.2 (Course & Category): FR7-FR12. */
@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;
    private final AuditService auditService;

    @Transactional
    public CourseResponse createCourse(User instructor, CourseCreateRequest req) {
        if (instructor.getRole() != Role.INSTRUCTOR && instructor.getRole() != Role.ADMIN) {
            throw new AccessDeniedCustomException("Only instructors can create courses.");
        }
        if (instructor.getRole() == Role.INSTRUCTOR && !instructor.isApproved()) {
            throw new BusinessRuleException("Your instructor account is pending Admin approval."); // FR2
        }
        Category category = req.categoryId() != null
                ? categoryRepository.findById(req.categoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"))
                : null;
        Course prerequisite = req.prerequisiteCourseId() != null
                ? courseRepository.findById(req.prerequisiteCourseId()).orElseThrow(() -> new ResourceNotFoundException("Prerequisite course not found"))
                : null;

        Course course = Course.builder()
                .title(req.title()).description(req.description()).thumbnail(req.thumbnail())
                .level(req.level()).price(req.price()).instructor(instructor).category(category)
                .prerequisiteCourse(prerequisite)
                .isCohortBased(Boolean.TRUE.equals(req.isCohortBased()))
                .seatLimit(req.seatLimit())
                .active(true).published(false)
                .build();
        course = courseRepository.save(course);
        auditService.log(instructor, "CREATE", "Course", course.getId(), course.getTitle());
        return withRatings(course);
    }

    /** FR7-FR10: an instructor's OWN course list — unlike browse(), includes drafts (unpublished
     *  courses), since browse() deliberately only surfaces published courses to the public. */
    public java.util.List<CourseResponse> myCourses(User instructor) {
        return courseRepository.findByInstructor(instructor).stream().map(this::withRatings).toList();
    }

    /** UI spec AD6: "top-rated courses" report — in-memory sort rather than a JPQL subquery
     *  ORDER BY, since it's an infrequent Admin-only report (not a hot path) and this keeps the
     *  exact same rating computation as everywhere else (withRatings()) instead of duplicating
     *  the average-rating logic in SQL. */
    public java.util.List<CourseResponse> topRatedCourses(int limit) {
        return courseRepository.findAll().stream()
                .filter(Course::isPublished)
                .map(this::withRatings)
                .sorted((a, b) -> Double.compare(
                        b.averageRating() == null ? 0.0 : b.averageRating(),
                        a.averageRating() == null ? 0.0 : a.averageRating()))
                .limit(limit)
                .toList();
    }

    public Page<CourseResponse> browse(Long categoryId, String q, Pageable pageable) {
        return courseRepository.browse(categoryId, q, pageable).map(this::withRatings);
    }

    @Transactional(readOnly = true)
    public CourseResponse getDetail(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        return withFullCurriculum(course);
    }

    @Transactional
    public CourseResponse update(User requester, Long courseId, CourseCreateRequest req) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        assertOwnerOrAdmin(requester, course);
        course.setTitle(req.title());
        course.setDescription(req.description());
        course.setThumbnail(req.thumbnail());
        course.setLevel(req.level());
        course.setPrice(req.price());
        if (req.categoryId() != null) {
            course.setCategory(categoryRepository.findById(req.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found")));
        }
        course = courseRepository.save(course);
        auditService.log(requester, "UPDATE", "Course", course.getId(), course.getTitle());
        return withRatings(course);
    }

    @Transactional
    public void setPublished(User requester, Long courseId, boolean published) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        assertOwnerOrAdmin(requester, course);
        course.setPublished(published);
        courseRepository.save(course);
        auditService.log(requester, published ? "PUBLISH" : "UNPUBLISH", "Course", course.getId(), null);
    }

    @Transactional
    public void deactivate(User admin, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        course.setActive(false);
        courseRepository.save(course);
        auditService.log(admin, "DEACTIVATE", "Course", course.getId(), null);
    }

    public void assertOwnerOrAdmin(User requester, Course course) {
        boolean owner = course.getInstructor().getId().equals(requester.getId());
        boolean admin = requester.getRole() == Role.ADMIN;
        if (!owner && !admin) {
            throw new AccessDeniedCustomException("You do not own this course."); // FR10
        }
    }

    public Course findEntity(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
    }

    private CourseResponse withRatings(Course course) {
        Double avg = reviewRepository.averageRatingForCourse(course);
        Long count = reviewRepository.countForCourse(course);
        course.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        course.setReviewCount(count != null ? count : 0L);
        return CourseResponse.summary(course);
    }

    /** Unlike withRatings(), also walks the (lazy) section/subsection graph — only called within a
     *  read transaction (see getDetail's @Transactional) so it's safe under open-in-view=false. */
    private CourseResponse withFullCurriculum(Course course) {
        CourseResponse base = withRatings(course);
        List<SectionResponse> sections = course.getSections().stream()
                .sorted((a, b) -> {
                    Integer oa = a.getOrder() != null ? a.getOrder() : 0;
                    Integer ob = b.getOrder() != null ? b.getOrder() : 0;
                    return oa.compareTo(ob);
                })
                .map(section -> new SectionResponse(
                        section.getId(), section.getTitle(), section.getOrder(),
                        section.getSubsections().stream()
                                .sorted((a, b) -> {
                                    Integer oa = a.getOrder() != null ? a.getOrder() : 0;
                                    Integer ob = b.getOrder() != null ? b.getOrder() : 0;
                                    return oa.compareTo(ob);
                                })
                                .map(sub -> new SubsectionResponse(sub.getId(), sub.getTitle(), sub.getContentType(), sub.getOrder(), false))
                                .toList()
                ))
                .toList();
        return new CourseResponse(base.id(), base.title(), base.description(), base.thumbnail(), base.level(),
                base.price(), base.published(), base.instructorName(), base.categoryName(),
                base.prerequisiteCourseId(), base.averageRating(), base.reviewCount(), sections);
    }
}
