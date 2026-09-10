package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "progress", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "subsection_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Progress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subsection_id", nullable = false)
    private Subsection subsection;

    @Builder.Default
    private boolean completed = false;

    @Builder.Default
    private Integer lastPositionSeconds = 0;
}
