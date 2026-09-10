package com.elearny.controller;

import com.elearny.dto.request.*;
import com.elearny.dto.response.AuthResponse;
import com.elearny.dto.response.TotpSetupResponse;
import com.elearny.dto.response.LoginHistoryResponse;
import com.elearny.dto.response.UserSummary;
import com.elearny.service.AuthService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "FR1-FR6, FR59-FR63")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserSummary> register(@Valid @RequestBody RegisterRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(authService.register(req, http.getRemoteAddr()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(authService.login(req, http.getRemoteAddr(), http.getHeader("User-Agent")));
    }

    @PostMapping("/2fa/challenge")
    public ResponseEntity<AuthResponse> complete2fa(@Valid @RequestBody TwoFactorChallengeRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(authService.complete2faChallenge(req, http.getRemoteAddr(), http.getHeader("User-Agent")));
    }

    @PostMapping("/2fa/setup")
    public ResponseEntity<TotpSetupResponse> setup2fa() {
        return ResponseEntity.ok(authService.setupTwoFactor(SecurityUtils.currentUser()));
    }

    @PostMapping("/2fa/activate")
    public ResponseEntity<Void> activate2fa(@Valid @RequestBody TwoFactorVerifyRequest req) {
        authService.verifyAndActivateTwoFactor(SecurityUtils.currentUser(), req.code());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest req) {
        return ResponseEntity.ok(authService.refresh(req));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<Void> logoutAll() {
        authService.logoutAll(SecurityUtils.currentUser());
        return ResponseEntity.ok().build();
    }

    /** UI spec S12/I10: Account & Security screen's login-history list. */
    @GetMapping("/login-history")
    public ResponseEntity<java.util.List<LoginHistoryResponse>> loginHistory(Pageable pageable) {
        return ResponseEntity.ok(authService.getLoginHistory(SecurityUtils.currentUser(), pageable));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ResponseEntity.ok().build();
    }
}
