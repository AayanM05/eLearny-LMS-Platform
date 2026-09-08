package com.elearny.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatResponse {
    private UUID conversationId;
    private String conversationTitle;
    private String reply;
    private List<AiChatMessageDto> messages;
}
