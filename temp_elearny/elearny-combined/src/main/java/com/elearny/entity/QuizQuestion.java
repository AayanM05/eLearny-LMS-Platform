package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quiz_questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuizQuestion extends BaseEntity {

    // Same hazard as Section.course: Quiz.questions is the matching @OneToMany.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Quiz quiz;

    @Lob
    @Column(nullable = false)
    private String questionText;

    // JSON-encoded list of options, e.g. ["A","B","C","D"]
    @Lob
    @Column(nullable = false)
    private String optionsJson;

    @Column(nullable = false)
    private String correctOption;
}
