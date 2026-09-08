package com.elearny.instructor.dto;

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
public class ApplyInstructorRequest {

    @NotBlank(message = "Professional headline is required")
    private String headline;

    @NotBlank(message = "Detailed bio & teaching experience is required")
    private String bio;

    @Min(value = 0, message = "Years of experience cannot be negative")
    private int experienceYears;

    private String sampleVideoUrl;
}
