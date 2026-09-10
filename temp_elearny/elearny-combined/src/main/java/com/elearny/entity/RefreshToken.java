package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RefreshToken extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Stored hashed (SHA-256) — never store raw refresh tokens
    @Column(nullable = false, unique = true)
    private String tokenHash;

    private LocalDateTime expiresAt;

    @Builder.Default
    private boolean revoked = false;
}
