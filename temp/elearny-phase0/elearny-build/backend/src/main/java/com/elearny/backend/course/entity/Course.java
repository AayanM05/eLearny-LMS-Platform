package com.elearny.backend.course.entity;

import com.elearny.backend.auth.entity.User;
import com.elearny.backend.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "courses")
public class Course extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @Column(length = 300)
    private String tagline;

    @Column(length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", length = 20)
    private DifficultyLevel difficultyLevel;

    @Column(name = "price_cents", nullable = false)
    private int priceCents = 0;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "promo_video_url", length = 500)
    private String promoVideoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CourseStatus status = CourseStatus.DRAFT;

    @Column(nullable = false)
    private int version = 1;
}
