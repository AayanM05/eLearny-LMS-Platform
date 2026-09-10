package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "live_session_slots")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LiveSessionSlot extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer capacity;

    @Builder.Default
    private Integer bookedCount = 0;

    @Version
    private Integer version;

    @Builder.Default
    private boolean cancelled = false;
}
