package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ta_assignments", uniqueConstraints = @UniqueConstraint(columnNames = {"course_id", "ta_user_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaAssignment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ta_user_id", nullable = false)
    private User taUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_by_id", nullable = false)
    private User invitedBy;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TaStatus status = TaStatus.PENDING;
}
