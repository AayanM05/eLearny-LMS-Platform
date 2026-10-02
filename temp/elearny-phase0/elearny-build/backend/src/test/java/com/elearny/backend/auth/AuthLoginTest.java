package com.elearny.backend.auth;

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
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Covers login, refresh, and account lockout. Each test registers its own
 * user (rather than sharing fixtures) so tests can run in any order without
 * interfering — @Transactional rolls everything back after each test.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthLoginTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmailService emailService;

    /** Registers a user and returns their real OTP (captured, never logged/stored in plaintext) so tests can verify their email before logging in. */
    private void registerAndVerify(String username, String email) throws Exception {
        String registerBody = objectMapper.writeValueAsString(new TestRegisterPayload(
                "Test", "User", username, email, "ValidPass1!", true
        ));
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(registerBody))
                .andExpect(status().isCreated());

        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendOtpEmail(anyString(), anyString(), otpCaptor.capture(), anyInt());
        String otp = otpCaptor.getValue();

        mockMvc.perform(post("/api/v1/auth/verify-email")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestVerifyPayload(email, otp))))
                .andExpect(status().isOk());
    }

    @Test
    void loginWithCorrectCredentials_returnsTokens() throws Exception {
        registerAndVerify("loginuser1", "loginuser1@example.com");

        String loginBody = objectMapper.writeValueAsString(new TestLoginPayload("loginuser1", "ValidPass1!"));
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(loginBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.user.username", is("loginuser1")));
    }

    @Test
    void loginBeforeEmailVerified_returns403() throws Exception {
        String registerBody = objectMapper.writeValueAsString(new TestRegisterPayload(
                "Test", "User", "unverifieduser", "unverified@example.com", "ValidPass1!", true
        ));
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(registerBody))
                .andExpect(status().isCreated());

        String loginBody = objectMapper.writeValueAsString(new TestLoginPayload("unverifieduser", "ValidPass1!"));
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(loginBody))
                .andExpect(status().isForbidden());
    }

    @Test
    void loginWithWrongPassword_returns401() throws Exception {
        registerAndVerify("wrongpwuser", "wrongpw@example.com");

        String loginBody = objectMapper.writeValueAsString(new TestLoginPayload("wrongpwuser", "TotallyWrongPass1!"));
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(loginBody))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginWithUnknownUsername_returns401() throws Exception {
        String loginBody = objectMapper.writeValueAsString(new TestLoginPayload("doesNotExist999", "SomePass1!"));
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(loginBody))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void fiveFailedAttempts_locksAccountEvenWithCorrectPasswordAfter() throws Exception {
        registerAndVerify("lockoutuser", "lockout@example.com");

        String wrongLoginBody = objectMapper.writeValueAsString(new TestLoginPayload("lockoutuser", "WrongPass1!"));
        // application-dev.yml sets elearny.account-lockout.max-failed-attempts: 5
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType("application/json")
                            .content(wrongLoginBody))
                    .andExpect(status().isUnauthorized());
        }

        // 6th attempt, even with the CORRECT password, must be rejected as locked.
        String correctLoginBody = objectMapper.writeValueAsString(new TestLoginPayload("lockoutuser", "ValidPass1!"));
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(correctLoginBody))
                .andExpect(status().isForbidden());
    }

    @Test
    void refreshWithValidRefreshToken_returnsNewAccessToken() throws Exception {
        registerAndVerify("refreshuser", "refresh@example.com");

        String loginBody = objectMapper.writeValueAsString(new TestLoginPayload("refreshuser", "ValidPass1!"));
        String loginResponseJson = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(loginBody))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String refreshToken = objectMapper.readTree(loginResponseJson).get("refreshToken").asText();

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestRefreshPayload(refreshToken))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()));
    }

    @Test
    void refreshWithAccessTokenInsteadOfRefreshToken_returns401() throws Exception {
        registerAndVerify("wrongtokentype", "wrongtokentype@example.com");

        String loginBody = objectMapper.writeValueAsString(new TestLoginPayload("wrongtokentype", "ValidPass1!"));
        String loginResponseJson = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(loginBody))
                .andReturn().getResponse().getContentAsString();

        String accessToken = objectMapper.readTree(loginResponseJson).get("accessToken").asText();

        // Submitting an access token where a refresh token is required must
        // be rejected, not silently accepted.
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestRefreshPayload(accessToken))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void refreshWithGarbageToken_returns401() throws Exception {
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new TestRefreshPayload("not-a-real-token"))))
                .andExpect(status().isUnauthorized());
    }

    private record TestRegisterPayload(
            String firstName, String lastName, String username, String email, String password, boolean termsAccepted
    ) {
    }

    private record TestVerifyPayload(String email, String otp) {
    }

    private record TestLoginPayload(String usernameOrEmail, String password) {
    }

    private record TestRefreshPayload(String refreshToken) {
    }
}
