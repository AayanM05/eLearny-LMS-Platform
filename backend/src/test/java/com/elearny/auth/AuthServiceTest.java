package com.elearny.auth;

import com.elearny.admin.AuditService;
import com.elearny.auth.dto.AuthResponse;
import com.elearny.auth.dto.LoginRequest;
import com.elearny.auth.dto.RegisterRequest;
import com.elearny.auth.security.JwtService;
import com.elearny.common.exception.AccessDeniedCustomException;
import com.elearny.common.exception.BusinessRuleException;
import com.elearny.notification.sender.NotificationDispatcher;
import com.elearny.privacy.ConsentService;
import com.elearny.user.Role;
import com.elearny.user.User;
import com.elearny.user.UserRepository;
import com.elearny.user.UserSummary;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private LoginHistoryRepository loginHistoryRepository;

    @Mock
    private NotificationDispatcher notificationDispatcher;

    @Mock
    private ConsentService consentService;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private User studentUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("Test User", "test@example.com", "+12345678901", "password123", Role.STUDENT, "1.0", false, null);

        studentUser = User.builder()
                .email("test@example.com")
                .password("hashed_password")
                .name("Test User")
                .phone("+12345678901")
                .role(Role.STUDENT)
                .active(true)
                .approved(true)
                .build();
        studentUser.setId(1L);
    }

    @Test
    void register_ShouldCreateUser_WhenEmailIsNotTaken() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(studentUser);

        UserSummary result = authService.register(registerRequest, "127.0.0.1");

        assertNotNull(result);
        assertEquals("test@example.com", result.email());
        assertEquals("Test User", result.name());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(BusinessRuleException.class, () -> authService.register(registerRequest, "127.0.0.1"));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_ShouldReturnAuthResponse_WhenCredentialsAreValid() {
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(studentUser));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(jwtService.generateAccessToken(eq(1L), eq("test@example.com"), eq("STUDENT"))).thenReturn("mocked_access_token");
        when(refreshTokenService.issue(any(User.class))).thenReturn("mocked_refresh_token");

        AuthResponse response = authService.login(loginRequest, "127.0.0.1", "JUnit Test Agent");

        assertNotNull(response);
        assertEquals("mocked_access_token", response.accessToken());
        assertEquals("mocked_refresh_token", response.refreshToken());
    }

    @Test
    void login_ShouldThrowException_WhenUserNotFound() {
        LoginRequest loginRequest = new LoginRequest("nonexistent@example.com", "password123");

        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        assertThrows(AccessDeniedCustomException.class, () -> authService.login(loginRequest, "127.0.0.1", "JUnit"));
    }
}
