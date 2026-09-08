package com.elearny.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscussionReplyDto {
    private UUID id;
    private UUID discussionId;
    private UUID authorId;
    private String authorName;
    private String content;
    private boolean acceptedAnswer;
    private Instant createdAt;
}
