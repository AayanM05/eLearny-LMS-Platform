package com.elearny.backend.course.entity;

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
@Table(name = "lessons")
public class Lesson extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private CourseSection section;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false, length = 20)
    private LessonContentType contentType;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(name = "article_content", columnDefinition = "TEXT")
    private String articleContent;

    @Column(name = "resource_url", length = 500)
    private String resourceUrl;

    @Column(nullable = false)
    private int position;

    @Column(name = "drip_delay_days", nullable = false)
    private int dripDelayDays = 0;
}
