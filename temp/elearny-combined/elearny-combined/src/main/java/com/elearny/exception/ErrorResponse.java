package com.elearny.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private String path;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    private List<String> validationErrors;
}
