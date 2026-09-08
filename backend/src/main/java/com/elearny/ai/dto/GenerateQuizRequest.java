package com.elearny.ai.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GenerateQuizRequest {
    @NotBlank
    private String topic;

    @Min(1)
    private int questionCount = 3;
}
