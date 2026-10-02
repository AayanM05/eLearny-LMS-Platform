package com.elearny.community;

import com.elearny.common.exception.AccessDeniedCustomException;
import com.elearny.community.dto.ForumThreadCreateRequest;
import com.elearny.community.dto.ForumThreadResponse;
import com.elearny.course.Course;
import com.elearny.course.CourseContentService;
import com.elearny.course.Section;
import com.elearny.course.Subsection;
import com.elearny.enrollment.EnrollmentRepository;
import com.elearny.ta.TaAssignmentRepository;
import com.elearny.user.Role;
import com.elearny.user.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ForumServiceTest {

    @Mock
    private ForumThreadRepository forumThreadRepository;

    @Mock
    private ForumReplyRepository forumReplyRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private TaAssignmentRepository taAssignmentRepository;

    @Mock
    private CourseContentService courseContentService;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private ForumService forumService;

    private User student;
    private Course course;
    private Subsection subsection;
    private ForumThread thread;

    @BeforeEach
    void setUp() {
        student = User.builder()
                .name("Student User")
                .email("student@example.com")
                .role(Role.STUDENT)
                .build();
        student.setId(1L);

        course = Course.builder().title("Spring Boot").build();
        course.setId(10L);

        Section section = Section.builder().course(course).build();
        section.setId(20L);

        subsection = Subsection.builder().section(section).build();
        subsection.setId(100L);

        thread = ForumThread.builder()
                .subsection(subsection)
                .student(student)
                .questionText("How does Spring Security filter work?")
                .upvotes(0)
                .build();
        thread.setId(500L);
    }

    @Test
    void createThread_ShouldCreateThread_WhenStudentIsEnrolled() {
        ForumThreadCreateRequest req = new ForumThreadCreateRequest("How does Spring Security filter work?");

        when(courseContentService.findSubsection(100L)).thenReturn(subsection);
        when(enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)).thenReturn(true);
        when(forumThreadRepository.save(any(ForumThread.class))).thenReturn(thread);

        ForumThreadResponse response = forumService.createThread(student, 100L, req);

        assertNotNull(response);
        assertEquals("How does Spring Security filter work?", response.questionText());
        verify(forumThreadRepository, times(1)).save(any(ForumThread.class));
    }

    @Test
    void createThread_ShouldThrowException_WhenStudentNotEnrolled() {
        ForumThreadCreateRequest req = new ForumThreadCreateRequest("How does Spring Security filter work?");

        when(courseContentService.findSubsection(100L)).thenReturn(subsection);
        when(enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)).thenReturn(false);

        assertThrows(AccessDeniedCustomException.class, () -> forumService.createThread(student, 100L, req));
        verify(forumThreadRepository, never()).save(any());
    }
}
