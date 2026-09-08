package com.elearny.ai.service;

import com.elearny.ai.dto.AiChatMessageDto;
import com.elearny.ai.dto.AiChatRequest;
import com.elearny.ai.dto.AiChatResponse;
import com.elearny.ai.entity.AiConversation;
import com.elearny.ai.entity.AiMessage;
import com.elearny.ai.repository.AiConversationRepository;
import com.elearny.ai.repository.AiMessageRepository;
import com.elearny.user.entity.User;
import com.elearny.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiChatService {

    private final AiConversationRepository conversationRepository;
    private final AiMessageRepository messageRepository;
    private final UserRepository userRepository;

    @Transactional
    public AiChatResponse processChatMessage(UUID userId, AiChatRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        AiConversation conversation;
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new IllegalArgumentException("Conversation not found: " + request.getConversationId()));
        } else {
            String title = request.getMessage().length() > 30
                    ? request.getMessage().substring(0, 30) + "..."
                    : request.getMessage();
            conversation = conversationRepository.save(AiConversation.builder()
                    .user(user)
                    .title(title)
                    .build());
        }

        // Save User Message
        AiMessage userMsg = AiMessage.builder()
                .conversation(conversation)
                .role("USER")
                .content(request.getMessage())
                .build();
        messageRepository.save(userMsg);

        // Generate AI Response
        String aiReply = generateAiResponse(request.getMessage());

        // Save AI Message
        AiMessage aiMsg = AiMessage.builder()
                .conversation(conversation)
                .role("ASSISTANT")
                .content(aiReply)
                .build();
        messageRepository.save(aiMsg);

        List<AiMessage> allMessages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId());

        return AiChatResponse.builder()
                .conversationId(conversation.getId())
                .conversationTitle(conversation.getTitle())
                .reply(aiReply)
                .messages(allMessages.stream().map(this::mapToDto).collect(Collectors.toList()))
                .build();
    }

    @Transactional(readOnly = true)
    public List<AiChatMessageDto> getConversationMessages(UUID conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private String generateAiResponse(String prompt) {
        String query = prompt.toLowerCase();
        if (query.contains("spring") || query.contains("java")) {
            return "Here is a quick breakdown for Spring Boot 3 & Java 21:\n- Use `@RestController` and `@RequiredArgsConstructor` for dependency injection.\n- Ensure JPA repositories extend `JpaRepository<Entity, UUID>`.\n- Configure Flyway in `src/main/resources/db/migration` for seamless schema management.";
        } else if (query.contains("react") || query.contains("next") || query.contains("expo")) {
            return "For Next.js 14 App Router & Expo SDK 51:\n- Use `'use client'` for interactive React components.\n- Keep logic modular using shared `@elearny/api-client` and `@elearny/config` packages.\n- Use Expo Router file-based routing (`app/(student)/...`) for smooth cross-platform mobile navigation.";
        } else {
            return "Hello! I am your eLearny AI Tutor. I can help answer course questions, debug code snippets, explain algorithms, and guide your learning journey. What concept would you like to explore today?";
        }
    }

    private AiChatMessageDto mapToDto(AiMessage m) {
        return AiChatMessageDto.builder()
                .id(m.getId())
                .role(m.getRole())
                .content(m.getContent())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
