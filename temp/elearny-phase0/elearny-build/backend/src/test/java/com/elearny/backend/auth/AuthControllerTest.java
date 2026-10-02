package com.elearny.backend.auth;

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

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Hits real endpoints against the real (Flyway-migrated) database.
 * EmailService is mocked (@MockBean) so no real SMTP call is ever attempted
 * — Mockito no-ops void methods by default — and so the actual OTP code can
 * be captured via ArgumentCaptor to test the full register-then-verify
 * flow, since the raw code is never otherwise retrievable (only its BCrypt
 * hash is stored). Each test method is wrapped in a transaction that's
 * rolled back afterward, so re-running this repeatedly never leaves junk
 * users behind or hits unique-constraint collisions across runs.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private EmailService emailService;

    @Test
    void registerWithValidDetails_returns201AndCreatedUser() throws Exception {
        String body = objectMapper.writeValueAsString(new TestRegisterPayload(
                "Ada", "Lovelace", "phase1tester", "phase1tester@example.com", "ValidPass1!", true
        ));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName", is("Ada")))
                .andExpect(jsonPath("$.username", is("phase1tester")))
                .andExpect(jsonPath("$.role", is("STUDENT")));

        // Registration must trigger exactly one OTP email attempt.
        verify(emailService).sendOtpEmail(anyString(), anyString(), anyString(), anyInt());

        // And the account must start unverified.
        boolean verified = userRepository.findByUsernameIgnoreCase("phase1tester").orElseThrow().isEmailVerified();
        assertThat(verified).isFalse();
    }

    @Test
    void registerWithWeakPassword_returns400WithFieldError() throws Exception {
        String body = objectMapper.writeValueAsString(new TestRegisterPayload(
                "Ada", "Lovelace", "weakpwuser", "weakpw@example.com", "weak", true
        ));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[0].field", is("password")));
    }

    @Test
    void registerWithoutAcceptingTerms_returns400() throws Exception {
        String body = objectMapper.writeValueAsString(new TestRegisterPayload(
                "Ada", "Lovelace", "noconsentuser", "noconsent@example.com", "ValidPass1!", false
        ));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void registerWithDuplicateUsername_returns409() throws Exception {
        TestRegisterPayload payload = new TestRegisterPayload(
                "Ada", "Lovelace", "dupeuser", "dupeuser1@example.com", "ValidPass1!", true
        );
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated());

        TestRegisterPayload sameUsername = new TestRegisterPayload(
                "Ada", "Lovelace", "dupeuser", "dupeuser2@example.com", "ValidPass1!", true
        );
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(sameUsername)))
                .andExpect(status().isConflict());
    }

    @Test
    void checkUsername_availableWhenNotTaken() throws Exception {
        mockMvc.perform(get("/api/v1/auth/check-username").param("username", "definitelyNotTaken123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available", is(true)));
    }

    @Test
    void registerThenVerifyWithCorrectOtp_marksEmailVerified() throws Exception {
        TestRegisterPayload payload = new TestRegisterPayload(
                "Grace", "Hopper", "otpverifyuser", "otpverify@example.com", "ValidPass1!", true
        );
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated());

        // Capture the actual OTP that was generated, since it's only ever
        // available as a BCrypt hash in the database otherwise.
        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendOtpEmail(anyString(), anyString(), otpCaptor.capture(), anyInt());
        String realOtp = otpCaptor.getValue();

        String verifyBody = objectMapper.writeValueAsString(new TestVerifyPayload("otpverify@example.com", realOtp));
        mockMvc.perform(post("/api/v1/auth/verify-email")
                        .contentType("application/json")
                        .content(verifyBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Email verified successfully.")));

        boolean verified = userRepository.findByUsernameIgnoreCase("otpverifyuser").orElseThrow().isEmailVerified();
        assertThat(verified).isTrue();
    }

    @Test
    void verifyEmailWithWrongOtp_returns400() throws Exception {
        TestRegisterPayload payload = new TestRegisterPayload(
                "Grace", "Hopper", "wrongotpuser", "wrongotp@example.com", "ValidPass1!", true
        );
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated());

        String verifyBody = objectMapper.writeValueAsString(new TestVerifyPayload("wrongotp@example.com", "000000"));
        mockMvc.perform(post("/api/v1/auth/verify-email")
                        .contentType("application/json")
                        .content(verifyBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void resendOtp_returnsGenericSuccessEvenForUnknownEmail() throws Exception {
        String body = objectMapper.writeValueAsString(new TestResendPayload("doesnotexist@example.com"));

        mockMvc.perform(post("/api/v1/auth/resend-otp")
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("If that email is registered, a new code has been sent.")));
    }

    private record TestRegisterPayload(
            String firstName,
            String lastName,
            String username,
            String email,
            String password,
            boolean termsAccepted
    ) {
    }

    private record TestVerifyPayload(String email, String otp) {
    }

    private record TestResendPayload(String email) {
    }
}
