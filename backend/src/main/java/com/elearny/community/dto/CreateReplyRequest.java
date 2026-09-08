package com.elearny.community.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateReplyRequest {
    @NotBlank
    private String content;
}
