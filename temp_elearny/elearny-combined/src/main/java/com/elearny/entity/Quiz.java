package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Quiz extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subsection_id", nullable = false, unique = true)
    private Subsection subsection;

    @Column(name = "pass_threshold_percent", nullable = false)
    private Integer passThresholdPercent;

    @Builder.Default
    private boolean allowMultipleAttempts = true;

    @Builder.Default
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizQuestion> questions = new ArrayList<>();
}
