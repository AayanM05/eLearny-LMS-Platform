package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subsections")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Subsection extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false)
    private ContentType contentType;

    private String contentUrl;

    @Column(name = "display_order")
    private Integer order;

    // Same circular-reference hazard as Section.course, one level down (Section.subsections).
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Section section;
}
