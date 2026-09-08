package com.elearny.practice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "practice_problems")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PracticeProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String difficulty = "EASY";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "starter_code", nullable = false, columnDefinition = "TEXT")
    private String starterCode;

    @Column(name = "test_cases", nullable = false, columnDefinition = "TEXT")
    private String testCases;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
