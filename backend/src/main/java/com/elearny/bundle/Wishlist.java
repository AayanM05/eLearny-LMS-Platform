package com.elearny.bundle;

import com.elearny.common.BaseEntity;
import com.elearny.course.Course;
import com.elearny.user.User;








import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wishlists", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Wishlist extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}
