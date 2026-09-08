package com.elearny.auth.controller;

import com.elearny.auth.dto.AuthResponse;
import com.elearny.auth.dto.LoginRequest;
import com.elearny.auth.dto.RegisterRequest;
import com.elearny.auth.service.AuthService;
import com.elearny.user.dto.UserDto;
import com.elearny.user.entity.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    public void shouldRegisterUserSuccessfully() throws Exception {
        RegisterRequest request = new RegisterRequest("student@elearny.com", "securePassword123", "Jane Student");
        UserDto userDto = UserDto.builder()
                .id(UUID.randomUUID())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .role(Role.STUDENT)
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken("mock-access-token")
                .refreshToken("mock-refresh-token")
                .is2faRequired(false)
                .user(userDto)
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value("mock-access-token"))
                .andExpect(jsonPath("$.user.email").value("student@elearny.com"))
                .andExpect(jsonPath("$.user.role").value("STUDENT"));
    }

    @Test
    public void shouldLoginUserSuccessfully() throws Exception {
        LoginRequest request = new LoginRequest("student@elearny.com", "securePassword123");
        UserDto userDto = UserDto.builder()
                .id(UUID.randomUUID())
                .email(request.getEmail())
                .fullName("Jane Student")
                .role(Role.STUDENT)
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken("mock-access-token")
                .refreshToken("mock-refresh-token")
                .is2faRequired(false)
                .user(userDto)
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mock-access-token"))
                .andExpect(jsonPath("$.user.email").value("student@elearny.com"));
    }
}
