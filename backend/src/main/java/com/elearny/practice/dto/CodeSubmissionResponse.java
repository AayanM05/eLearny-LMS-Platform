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
public class CodeSubmissionResponse {
    private UUID id;
    private UUID problemId;
    private String problemTitle;
    private String language;
    private String sourceCode;
    private String status; // PASSED, FAILED, COMPILATION_ERROR
    private Integer executionTimeMs;
    private Instant createdAt;
    private String outputLog;
}
