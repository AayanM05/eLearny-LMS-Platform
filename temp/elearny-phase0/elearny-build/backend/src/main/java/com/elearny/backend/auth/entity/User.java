package com.elearny.backend.auth.entity;

import com.elearny.backend.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Core identity record for every eLearny user, regardless of role.
 *
 * `twoFactorSecret` deliberately has no getter exposed beyond the entity
 * itself in practice — never map it into any DTO or API response. It's only
 * read internally by the future TOTP verification service (2FA challenge).
 */
@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(name = "account_locked", nullable = false)
    private boolean accountLocked = false;

    @Column(name = "failed_login_attempts", nullable = false)
    private int failedLoginAttempts = 0;

    @Column(name = "two_factor_enabled", nullable = false)
    private boolean twoFactorEnabled = false;

    @Column(name = "two_factor_secret")
    private String twoFactorSecret;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    // Instructor invite-and-activate support (prd.md §3.26) — see
    // V5__instructor_and_courses.sql's comment for why these live here.
    @Column(name = "pending_activation", nullable = false)
    private boolean pendingActivation = false;

    @Column(name = "activation_token_hash")
    private String activationTokenHash;

    @Column(name = "activation_token_expires_at")
    private Instant activationTokenExpiresAt;
}
