package com.elearny.course;

import com.elearny.admin.AuditService;
import com.elearny.common.exception.ResourceNotFoundException;
import com.elearny.course.dto.CourseCreateRequest;
import com.elearny.course.dto.CourseResponse;
import com.elearny.discovery.Category;
import com.elearny.discovery.CategoryRepository;
import com.elearny.review.ReviewRepository;
import com.elearny.user.Role;
import com.elearny.user.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private CourseService courseService;

    private User instructor;
    private Category category;
    private Course course;

    @BeforeEach
    void setUp() {
        instructor = User.builder()
                .email("instructor@example.com")
                .name("Jane Instructor")
                .role(Role.INSTRUCTOR)
                .approved(true)
                .build();
        instructor.setId(2L);

        category = Category.builder()
                .name("Web Development")
                .build();
        category.setId(1L);

        course = Course.builder()
                .title("Modern React & Spring Boot")
                .instructor(instructor)
                .category(category)
                .price(BigDecimal.valueOf(99.99))
                .published(false)
                .level(CourseLevel.INTERMEDIATE)
                .build();
        course.setId(10L);
    }

    @Test
    void createCourse_ShouldCreateCourse_WhenCategoryExists() {
        CourseCreateRequest request = new CourseCreateRequest(
                "Modern React & Spring Boot", "Learn fullstack", "thumb.jpg",
                CourseLevel.INTERMEDIATE, BigDecimal.valueOf(99.99), 1L, null, false, null
        );

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        CourseResponse result = courseService.createCourse(instructor, request);

        assertNotNull(result);
        assertEquals("Modern React & Spring Boot", result.title());
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void createCourse_ShouldThrowException_WhenCategoryNotFound() {
        CourseCreateRequest request = new CourseCreateRequest(
                "Modern React & Spring Boot", "Learn fullstack", "thumb.jpg",
                CourseLevel.INTERMEDIATE, BigDecimal.valueOf(99.99), 99L, null, false, null
        );

        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> courseService.createCourse(instructor, request));
        verify(courseRepository, never()).save(any());
    }

    @Test
    void setPublished_ShouldUpdatePublishStatus_WhenUserIsOwner() {
        when(courseRepository.findById(10L)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        courseService.setPublished(instructor, 10L, true);

        assertTrue(course.isPublished());
        verify(courseRepository, times(1)).save(course);
    }
}
