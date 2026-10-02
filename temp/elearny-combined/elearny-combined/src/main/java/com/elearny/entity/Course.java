package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Course extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Lob
    private String description;

    private String thumbnail;

    @Enumerated(EnumType.STRING)
    private CourseLevel level;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private boolean published = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prerequisite_course_id")
    private Course prerequisiteCourse;

    @Builder.Default
    private boolean isCohortBased = false;

    private Integer seatLimit;

    // Now that Section.course is @JsonIgnore'd, this list is safe to serialize (no more cycle) —
    // but it's still unwanted noise whenever a raw Course gets nested inside Enrollment, Wishlist,
    // TaAssignment, or LiveSessionSlot (none of those views need the full curriculum tree).
    // CourseController's own endpoints never hit this: they go through CourseService's
    // withFullCurriculum(), which walks this list in plain Java, not via Jackson — @JsonIgnore
    // only affects serialization, so that code path is completely unaffected.
    @Builder.Default
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("order ASC")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Section> sections = new ArrayList<>();

    @Builder.Default
    @Transient
    private Double averageRating = 0.0;

    @Builder.Default
    @Transient
    private Long reviewCount = 0L;
}
