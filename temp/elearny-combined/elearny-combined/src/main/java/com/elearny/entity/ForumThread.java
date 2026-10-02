package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "forum_threads")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ForumThread extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subsection_id", nullable = false)
    private Subsection subsection;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Lob
    @Column(nullable = false)
    private String questionText;

    @Builder.Default
    private Integer upvotes = 0;

    @Builder.Default
    @OneToMany(mappedBy = "thread", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ForumReply> replies = new ArrayList<>();
}
