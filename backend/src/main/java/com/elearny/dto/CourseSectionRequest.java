package com.elearny.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseSectionRequest {
    @NotBlank(message = "Section title is required")
    private String title;
    private String description;
    private int orderIndex;
}
