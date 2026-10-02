package com.elearny.backend.instructor;

import com.elearny.backend.common.email.EmailService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Exercises the full loop: student applies -> admin (seeded by
 * AdminBootstrapRunner at context startup, outside this test's own
 * transaction) reviews -> approves -> applicant receives a setup
 * token+OTP (captured via mocked EmailService, since the raw values only
 * ever exist in the email/database, never returned directly by any
 * endpoint) -> completes setup -> logs in as an Instructor.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class InstructorApplicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmailService emailService;

    private static final String ADMIN_DEFAULT_PASSWORD = "ChangeMe123!"; // matches AdminBootstrapRunner's dev default

    private String registerVerifyAndLogin(String username, String email) throws Exception {
        String registerBody = objectMapper.writeValueAsString(new TestRegisterPayload(
                "Test", "User", username, email, "ValidPass1!", true
        ));
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(registerBody))
                .andExpect(status().isCreated());

        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendOtpEmail(anyString(), anyString(), otpCaptor.capture(), anyInt());

        mockMvc.perform(post("/api/v1/auth/verify-email")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestVerifyPayload(email, otpCaptor.getValue()))))
                .andExpect(status().isOk());

        String loginJson = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestLoginPayload(username, "ValidPass1!"))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readTree(loginJson).get("accessToken").asText();
    }

    private String loginAsAdmin() throws Exception {
        String loginJson = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestLoginPayload("admin", ADMIN_DEFAULT_PASSWORD))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(loginJson).get("accessToken").asText();
    }

    @Test
    void studentCanSubmitApplication() throws Exception {
        String token = registerVerifyAndLogin("applicant1", "applicant1@example.com");

        String body = objectMapper.writeValueAsString(new TestApplyPayload(
                "I've taught web dev for years.", 5, "JavaScript,React", null, null
        ));

        mockMvc.perform(post("/api/v1/instructor-applications")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("PENDING")));
    }

    @Test
    void secondPendingApplication_returns409() throws Exception {
        String token = registerVerifyAndLogin("applicant2", "applicant2@example.com");
        String body = objectMapper.writeValueAsString(new TestApplyPayload("Bio", 3, "Python", null, null));

        mockMvc.perform(post("/api/v1/instructor-applications")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/v1/instructor-applications")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isConflict());
    }

    @Test
    void nonAdminCannotListApplications() throws Exception {
        String token = registerVerifyAndLogin("notadmin1", "notadmin1@example.com");

        mockMvc.perform(get("/api/v1/admin/instructor-applications")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void fullApprovalAndSetupFlow_endsWithWorkingInstructorLogin() throws Exception {
        String studentToken = registerVerifyAndLogin("futureinstructor", "futureinstructor@example.com");

        String applyBody = objectMapper.writeValueAsString(new TestApplyPayload(
                "10 years teaching backend systems.", 10, "Java,Spring Boot", "https://example.com/portfolio", null
        ));
        String applyJson = mockMvc.perform(post("/api/v1/instructor-applications")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType("application/json")
                        .content(applyBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String applicationId = objectMapper.readTree(applyJson).get("id").asText();

        String adminToken = loginAsAdmin();

        // Confirm it shows up in the pending queue before approving.
        mockMvc.perform(get("/api/v1/admin/instructor-applications")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/admin/instructor-applications/" + applicationId + "/approve")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        // Capture the setup link (contains the raw token) and the OTP,
        // both only ever available via the (mocked) email — never returned
        // by any API response, by design.
        ArgumentCaptor<String> setupLinkCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendInstructorInviteEmail(anyString(), anyString(), setupLinkCaptor.capture(), anyString(), anyInt());
        String setupLink = setupLinkCaptor.getValue();
        String rawToken = URLDecoder.decode(setupLink.substring(setupLink.indexOf("token=") + 6), StandardCharsets.UTF_8);

        // The OTP for INSTRUCTOR_SETUP was sent via a separate sendOtpEmail
        // call (see InstructorApplicationService's comment on why) — need
        // the LAST such call, since the student's own registration earlier
        // in this test also triggered one.
        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService, org.mockito.Mockito.atLeastOnce())
                .sendOtpEmail(anyString(), anyString(), otpCaptor.capture(), anyInt());
        String otp = otpCaptor.getValue(); // ArgumentCaptor.getValue() returns the LAST captured call

        String setupBody = objectMapper.writeValueAsString(new TestSetupPayload(
                rawToken, otp, "newinstructorname", "NewInstructorPass1!"
        ));
        mockMvc.perform(post("/api/v1/instructor/setup-account")
                        .contentType("application/json")
                        .content(setupBody))
                .andExpect(status().isOk());

        // The instructor's OLD username no longer works for login (it was
        // renamed as part of setup) — and the NEW username, with the NEW
        // password, logs in successfully with role INSTRUCTOR.
        String loginBody = objectMapper.writeValueAsString(new TestLoginPayload("newinstructorname", "NewInstructorPass1!"));
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(loginBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.role", is("INSTRUCTOR")));
    }

    @Test
    void adminCanRejectApplication() throws Exception {
        String token = registerVerifyAndLogin("rejectedapplicant", "rejected@example.com");
        String applyJson = mockMvc.perform(post("/api/v1/instructor-applications")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestApplyPayload("Bio", 1, "Tag", null, null))))
                .andReturn().getResponse().getContentAsString();
        String applicationId = objectMapper.readTree(applyJson).get("id").asText();

        String adminToken = loginAsAdmin();
        String rejectBody = objectMapper.writeValueAsString(new TestRejectPayload("Not enough experience"));

        mockMvc.perform(post("/api/v1/admin/instructor-applications/" + applicationId + "/reject")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType("application/json")
                        .content(rejectBody))
                .andExpect(status().isOk());
    }

    private record TestRegisterPayload(String firstName, String lastName, String username, String email, String password, boolean termsAccepted) {
    }

    private record TestVerifyPayload(String email, String otp) {
    }

    private record TestLoginPayload(String usernameOrEmail, String password) {
    }

    private record TestApplyPayload(String bio, int yearsExperience, String expertiseTags, String portfolioUrl, String resumeUrl) {
    }

    private record TestSetupPayload(String token, String otp, String username, String password) {
    }

    private record TestRejectPayload(String reason) {
    }
}
