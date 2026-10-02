package com.elearny.exam;

import com.elearny.course.ContentType;
import com.elearny.course.Course;
import com.elearny.course.CourseContentService;
import com.elearny.course.CourseService;
import com.elearny.course.Section;
import com.elearny.course.Subsection;
import com.elearny.enrollment.EnrollmentRepository;
import com.elearny.enrollment.ProgressService;
import com.elearny.exam.dto.QuizAttemptRequest;
import com.elearny.exam.dto.QuizAttemptResponse;
import com.elearny.user.Role;
import com.elearny.user.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuizQuestionRepository quizQuestionRepository;

    @Mock
    private QuizAttemptRepository quizAttemptRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private CourseContentService courseContentService;

    @Mock
    private CourseService courseService;

    @Mock
    private ProgressService progressService;

    @InjectMocks
    private QuizService quizService;

    private User student;
    private Quiz quiz;
    private QuizQuestion question1;
    private Course course;

    @BeforeEach
    void setUp() {
        student = User.builder()
                .email("student@example.com")
                .role(Role.STUDENT)
                .build();
        student.setId(1L);

        course = Course.builder().title("Test Course").build();
        course.setId(10L);

        Section section = Section.builder().course(course).build();
        section.setId(20L);

        Subsection subsection = Subsection.builder()
                .contentType(ContentType.QUIZ)
                .section(section)
                .build();
        subsection.setId(100L);

        quiz = Quiz.builder()
                .subsection(subsection)
                .passThresholdPercent(60)
                .allowMultipleAttempts(true)
                .build();
        quiz.setId(1L);

        question1 = QuizQuestion.builder()
                .quiz(quiz)
                .questionText("What is 2 + 2?")
                .correctOption("4")
                .build();
        question1.setId(10L);

        quiz.setQuestions(List.of(question1));
    }

    @Test
    void attempt_ShouldCalculatePassStatus_WhenAnswersAreSubmitted() {
        QuizAttemptRequest request = new QuizAttemptRequest(Map.of(10L, "4"));

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)).thenReturn(true);
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenAnswer(i -> i.getArgument(0));

        QuizAttemptResponse response = quizService.attempt(student, 1L, request);

        assertNotNull(response);
        assertEquals(100, response.scorePercent());
        assertTrue(response.passed());
    }
}
