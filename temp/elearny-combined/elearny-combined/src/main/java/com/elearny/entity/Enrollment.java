package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "enrollments", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Enrollment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private LocalDate enrolledDate;

    @Builder.Default
    private boolean revoked = false;
}
