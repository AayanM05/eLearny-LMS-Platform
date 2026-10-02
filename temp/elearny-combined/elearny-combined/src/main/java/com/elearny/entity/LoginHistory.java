package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginHistory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String ipAddress;

    private String deviceInfo;

    private LocalDateTime loggedInAt;
}
