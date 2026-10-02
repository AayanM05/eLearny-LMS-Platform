package com.elearny.discovery;

import com.elearny.common.BaseEntity;








import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Category extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;
}
