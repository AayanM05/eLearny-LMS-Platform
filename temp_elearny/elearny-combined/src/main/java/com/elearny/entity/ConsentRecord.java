package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "consent_records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ConsentRecord extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String consentTextVersion;

    private String ipAddress;

    @Builder.Default
    private boolean isParental = false;

    private LocalDateTime signedAt;
}
