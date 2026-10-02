package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sections")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Section extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(name = "display_order")
    private Integer order;

    // CRITICAL: Course has a matching @OneToMany List<Section> sections. Without @JsonIgnore
    // here, any endpoint that ever serializes a raw Section (or anything nesting one — Quiz,
    // Assignment, and their downstream DTOs-that-forgot-to-be-DTOs) recurses forever:
    // section -> course -> course.sections -> [this section] -> course -> ... until a
    // StackOverflowError, which Spring turns into a 500 *after* the actual DB write already
    // committed. That combination (silent success + a scary-looking error) is exactly what
    // makes this bug class so easy to miss in review and so confusing to hit at runtime.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Course course;

    @Builder.Default
    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("order ASC")
    private List<Subsection> subsections = new ArrayList<>();
}
