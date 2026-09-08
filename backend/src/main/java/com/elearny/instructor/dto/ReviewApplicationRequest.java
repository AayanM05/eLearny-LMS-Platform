package com.elearny.instructor.dto;

import com.elearny.instructor.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewApplicationRequest {

    @NotNull(message = "Review status decision is required")
    private ApplicationStatus status; // APPROVED or REJECTED

    private String adminNotes;
}
