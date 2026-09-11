package com.elearny.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstructorApplicationRequest {

    @NotBlank(message = "Bio is required")
    private String bio;

    @Min(value = 0, message = "Years of experience cannot be negative")
    private int experienceYears;

    @NotBlank(message = "Expertise tags are required")
    private String expertiseTags;

    private String portfolioUrl;
    private String resumeUrl;
}
