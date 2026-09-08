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
public class PracticeProblemDto {
    private UUID id;
    private String title;
    private String slug;
    private String difficulty;
    private String description;
    private String starterCode;
    private String testCases;
    private Instant createdAt;
}
