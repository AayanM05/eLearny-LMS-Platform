package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Assignment extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subsection_id", nullable = false, unique = true)
    private Subsection subsection;

    @Lob
    private String instructions;

    private String allowedFileTypes;

    private LocalDateTime dueDate;
}
