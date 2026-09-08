package com.elearny.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscussionDto {
    private UUID id;
    private UUID courseId;
    private UUID authorId;
    private String authorName;
    private String title;
    private String content;
    private boolean pinned;
    private Instant createdAt;
    private int replyCount;
    private List<DiscussionReplyDto> replies;
}
