package com.elearny.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "phone")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    /** Never serialized to JSON — see JsonIgnore. Even when a User is nested inside another
     *  entity's response (Enrollment.user, Notification.user, etc.), the hash stays server-side. */
    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    private boolean approved = false;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private boolean totpEnabled = false;

    @JsonIgnore
    private String totpSecret;

    @JsonIgnore
    @Builder.Default
    private int failedLoginAttempts = 0;

    @JsonIgnore
    private java.time.LocalDateTime lockedUntil;

    @Builder.Default
    private boolean anonymized = false;

    /** FR34 / UI spec I5: Admin-granted permission letting a specific Instructor create
     *  platform-wide (not just course-scoped) coupons. Off by default — "eligible" is an
     *  explicit Admin decision per instructor, not an automatic status, to avoid quietly
     *  handing out platform-wide discount power. */
    @Builder.Default
    private boolean canCreatePlatformCoupons = false;

    public boolean isLocked() {
        return lockedUntil != null && lockedUntil.isAfter(java.time.LocalDateTime.now());
    }
}
