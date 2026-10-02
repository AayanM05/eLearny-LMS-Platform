package com.elearny.backend.course;

import com.elearny.backend.auth.entity.Role;
import com.elearny.backend.auth.repository.UserRepository;
import com.elearny.backend.common.email.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Registers real Student accounts through the actual API (same as every
 * other test in this codebase), then promotes to Instructor directly via
 * the repository rather than re-running the full application/approval/
 * setup dance covered by InstructorApplicationTest — that flow is already
 * tested there; these tests are about course authoring itself.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private EmailService emailService;

    private String registerAsInstructorAndLogin(String username, String email) throws Exception {
        String registerBody = objectMapper.writeValueAsString(new TestRegisterPayload(
                "Test", "Instructor", username, email, "ValidPass1!", true
        ));
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(registerBody))
                .andExpect(status().isCreated());

        // atLeastOnce() (not the implicit times(1) default) — this helper is
        // called TWICE within instructorCannotAccessAnotherInstructorsCourse
        // (once per instructor account), and Mockito's verify() counts total
        // invocations across the whole test method, not "since the last
        // verify() call". A plain verify(emailService) broke on the second
        // call with "wanted 1 time, but was 2 times" (found 2026-09-19).
        // ArgumentCaptor.getValue() still correctly returns the MOST RECENT
        // capture either way, so this remains correct for the single-call
        // case too.
        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService, org.mockito.Mockito.atLeastOnce()).sendOtpEmail(anyString(), anyString(), otpCaptor.capture(), anyInt());
        mockMvc.perform(post("/api/v1/auth/verify-email")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestVerifyPayload(email, otpCaptor.getValue()))))
                .andExpect(status().isOk());

        // Promote directly — the application/approval/setup flow itself is
        // covered by InstructorApplicationTest, not re-tested here.
        var user = userRepository.findByUsernameIgnoreCase(username).orElseThrow();
        user.setRole(Role.INSTRUCTOR);
        userRepository.save(user);

        String loginJson = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestLoginPayload(username, "ValidPass1!"))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(loginJson).get("accessToken").asText();
    }

    @Test
    void instructorCanCreateCourse() throws Exception {
        String token = registerAsInstructorAndLogin("courseinstructor1", "courseinstructor1@example.com");

        String body = objectMapper.writeValueAsString(new TestSaveCoursePayload(
                "Intro to Spring Boot", "Learn the basics", "Backend", "BEGINNER", 4999, null, null
        ));

        mockMvc.perform(post("/api/v1/instructor/courses")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Intro to Spring Boot")))
                .andExpect(jsonPath("$.status", is("DRAFT")))
                .andExpect(jsonPath("$.slug", is("intro-to-spring-boot")));
    }

    @Test
    void studentCannotCreateCourse() throws Exception {
        String registerBody = objectMapper.writeValueAsString(new TestRegisterPayload(
                "Plain", "Student", "plainstudent1", "plainstudent1@example.com", "ValidPass1!", true
        ));
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(registerBody))
                .andExpect(status().isCreated());

        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService, org.mockito.Mockito.atLeastOnce()).sendOtpEmail(anyString(), anyString(), otpCaptor.capture(), anyInt());
        mockMvc.perform(post("/api/v1/auth/verify-email")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestVerifyPayload("plainstudent1@example.com", otpCaptor.getValue()))))
                .andExpect(status().isOk());

        String loginJson = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestLoginPayload("plainstudent1", "ValidPass1!"))))
                .andReturn().getResponse().getContentAsString();
        String studentToken = objectMapper.readTree(loginJson).get("accessToken").asText();

        String body = objectMapper.writeValueAsString(new TestSaveCoursePayload(
                "Should Not Work", null, null, null, 0, null, null
        ));
        mockMvc.perform(post("/api/v1/instructor/courses")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    void publishFailsWithoutSectionsThenSucceedsAfterAddingContent() throws Exception {
        String token = registerAsInstructorAndLogin("courseinstructor2", "courseinstructor2@example.com");

        String courseJson = mockMvc.perform(post("/api/v1/instructor/courses")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestSaveCoursePayload(
                                "Empty Course", null, null, null, 0, null, null
                        ))))
                .andReturn().getResponse().getContentAsString();
        String courseId = objectMapper.readTree(courseJson).get("id").asText();

        // No sections yet — publish must fail.
        mockMvc.perform(post("/api/v1/instructor/courses/" + courseId + "/publish")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());

        String sectionJson = mockMvc.perform(post("/api/v1/instructor/courses/" + courseId + "/sections")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestSectionPayload("Section 1", 0))))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String sectionId = objectMapper.readTree(sectionJson).get("id").asText();

        // Section exists but has no lessons yet — publish must still fail.
        mockMvc.perform(post("/api/v1/instructor/courses/" + courseId + "/publish")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/v1/instructor/courses/" + courseId + "/sections/" + sectionId + "/lessons")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestLessonPayload(
                                "Lesson 1", "ARTICLE", null, "Some content", null, 0, 0
                        ))))
                .andExpect(status().isCreated());

        // Now it has a section with a lesson — publish must succeed.
        mockMvc.perform(post("/api/v1/instructor/courses/" + courseId + "/publish")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PUBLISHED")));
    }

    @Test
    void courseDetailReturnsNestedSectionsAndLessons() throws Exception {
        String token = registerAsInstructorAndLogin("courseinstructor3", "courseinstructor3@example.com");

        String courseJson = mockMvc.perform(post("/api/v1/instructor/courses")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestSaveCoursePayload(
                                "Nested Course", null, null, null, 0, null, null
                        ))))
                .andReturn().getResponse().getContentAsString();
        String courseId = objectMapper.readTree(courseJson).get("id").asText();

        String sectionJson = mockMvc.perform(post("/api/v1/instructor/courses/" + courseId + "/sections")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestSectionPayload("Getting Started", 0))))
                .andReturn().getResponse().getContentAsString();
        String sectionId = objectMapper.readTree(sectionJson).get("id").asText();

        mockMvc.perform(post("/api/v1/instructor/courses/" + courseId + "/sections/" + sectionId + "/lessons")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestLessonPayload(
                                "Welcome Video", "VIDEO", "https://example.com/video.mp4", null, null, 0, 0
                        ))))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/v1/instructor/courses/" + courseId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sections[0].title", is("Getting Started")))
                .andExpect(jsonPath("$.sections[0].lessons[0].title", is("Welcome Video")));
    }

    @Test
    void instructorCannotAccessAnotherInstructorsCourse() throws Exception {
        String tokenA = registerAsInstructorAndLogin("courseownerA", "courseownerA@example.com");
        String tokenB = registerAsInstructorAndLogin("courseownerB", "courseownerB@example.com");

        String courseJson = mockMvc.perform(post("/api/v1/instructor/courses")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestSaveCoursePayload(
                                "Owner A's Course", null, null, null, 0, null, null
                        ))))
                .andReturn().getResponse().getContentAsString();
        String courseId = objectMapper.readTree(courseJson).get("id").asText();

        mockMvc.perform(get("/api/v1/instructor/courses/" + courseId)
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isNotFound());
    }

    private record TestRegisterPayload(String firstName, String lastName, String username, String email, String password, boolean termsAccepted) {
    }

    private record TestVerifyPayload(String email, String otp) {
    }

    private record TestLoginPayload(String usernameOrEmail, String password) {
    }

    private record TestSaveCoursePayload(String title, String tagline, String category, String difficultyLevel, int priceCents, String thumbnailUrl, String promoVideoUrl) {
    }

    private record TestSectionPayload(String title, int position) {
    }

    private record TestLessonPayload(String title, String contentType, String videoUrl, String articleContent, String resourceUrl, int position, int dripDelayDays) {
    }
}
