package com.elearny.backend.auth.controller;

import com.elearny.backend.auth.dto.LoginRequest;
import com.elearny.backend.auth.dto.LoginResponse;
import com.elearny.backend.auth.dto.MessageResponse;
import com.elearny.backend.auth.dto.RefreshRequest;
import com.elearny.backend.auth.dto.RefreshResponse;
import com.elearny.backend.auth.dto.RegisterRequest;
import com.elearny.backend.auth.dto.RegisterResponse;
import com.elearny.backend.auth.dto.ResendOtpRequest;
import com.elearny.backend.auth.dto.UsernameAvailabilityResponse;
import com.elearny.backend.auth.dto.VerifyEmailRequest;
import com.elearny.backend.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * TOTP 2FA setup/challenge is not wired into login yet — that's a follow-up
 * sub-slice. See docs/memory.md for exactly what's verified so far.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/check-username")
    public UsernameAvailabilityResponse checkUsername(@RequestParam String username) {
        return new UsernameAvailabilityResponse(username, authService.isUsernameAvailable(username));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        return authService.register(request, httpRequest.getRemoteAddr());
    }

    @PostMapping("/verify-email")
    public MessageResponse verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request.email(), request.otp());
        return new MessageResponse("Email verified successfully.");
    }

    @PostMapping("/resend-otp")
    public MessageResponse resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        authService.resendOtp(request.email());
        return new MessageResponse("If that email is registered, a new code has been sent.");
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public RefreshResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request);
    }
}
