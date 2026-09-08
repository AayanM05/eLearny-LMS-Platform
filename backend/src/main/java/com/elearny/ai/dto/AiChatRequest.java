package com.elearny.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class AiChatRequest {
    private UUID conversationId;

    @NotBlank
    private String message;
}
