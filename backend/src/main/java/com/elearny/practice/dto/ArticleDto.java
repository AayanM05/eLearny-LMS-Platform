package com.elearny.practice.dto;

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
public class ArticleDto {
    private UUID id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String category;
    private String authorName;
    private Instant createdAt;
}
