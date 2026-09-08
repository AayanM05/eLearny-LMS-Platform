package com.elearny.ai.controller;

import com.elearny.ai.dto.*;
import com.elearny.ai.service.AiAuthoringService;
import com.elearny.ai.service.AiChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiChatController {

    private final AiChatService aiChatService;
    private final AiAuthoringService aiAuthoringService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = aiChatService.processChatMessage(UUID.fromString(userId), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<AiChatMessageDto>> getConversationMessages(@PathVariable UUID id) {
        List<AiChatMessageDto> messages = aiChatService.getConversationMessages(id);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/generate-quiz")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<AiQuizDraftDto> generateQuizDraft(@Valid @RequestBody GenerateQuizRequest request) {
        AiQuizDraftDto draft = aiAuthoringService.generateQuizDraft(request);
        return ResponseEntity.ok(draft);
    }
}
