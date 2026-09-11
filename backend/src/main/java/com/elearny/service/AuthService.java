package com.elearny.service;

import com.elearny.dto.*;
import com.elearny.entity.*;
import com.elearny.repository.*;
import com.elearny.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final ConsentRecordRepository consentRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public UsernameCheckResponse checkUsername(String username) {
        boolean exists = userRepository.existsByUsername(username);
        List<String> suggestions = new ArrayList<>();
        if (exists) {
            suggestions.add(username + "_2026");
            suggestions.add(username + "_lms");
            suggestions.add(username + "123");
        }
        return UsernameCheckResponse.builder()
                .username(username)
                .available(!exists)
                .suggestions(suggestions)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, String ipAddress) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        RoleEnum targetRoleEnum = "INSTRUCTOR".equalsIgnoreCase(request.getRole()) 
                ? RoleEnum.ROLE_STUDENT // Instructors register as STUDENT first, then apply for elevation per Flow 02
                : RoleEnum.ROLE_STUDENT;

        Role role = roleRepository.findByName(targetRoleEnum)
                .orElseGet(() -> roleRepository.save(Role.builder().name(targetRoleEnum).build()));

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .accountNonLocked(true)
                .roles(Set.of(role))
                .build();

        User savedUser = userRepository.save(user);

        // Record GDPR Consent
        if (request.isTermsAccepted()) {
            consentRecordRepository.save(ConsentRecord.builder()
                    .user(savedUser)
                    .termsVersion("v1.0")
                    .privacyVersion("v1.0")
                    .ipAddress(ipAddress)
                    .build());
        }

        // Generate JWT Access Token
        String rolesStr = savedUser.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.joining(","));

        String accessToken = tokenProvider.generateTokenFromUsername(savedUser.getUsername(), rolesStr);

        // Generate Refresh Token
        String refreshTokenStr = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .user(savedUser)
                .token(refreshTokenStr)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .user(mapToUserDto(savedUser))
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String accessToken = tokenProvider.generateToken(authentication);

        // Revoke existing refresh tokens and create new one
        refreshTokenRepository.deleteByUser(user);

        String refreshTokenStr = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(refreshTokenStr)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .user(mapToUserDto(user))
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr) {
        RefreshToken token = refreshTokenRepository.findByToken(refreshTokenStr)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (token.isRevoked() || token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token is expired or revoked");
        }

        User user = token.getUser();
        String rolesStr = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.joining(","));

        String newAccessToken = tokenProvider.generateTokenFromUsername(user.getUsername(), rolesStr);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshTokenStr)
                .user(mapToUserDto(user))
                .build();
    }

    public UserDto getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mapToUserDto(user);
    }

    private UserDto mapToUserDto(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());

        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .enabled(user.isEnabled())
                .isTotpEnabled(user.isTotpEnabled())
                .build();
    }
}
