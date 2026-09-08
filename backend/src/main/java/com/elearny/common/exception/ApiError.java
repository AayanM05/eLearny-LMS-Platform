package com.elearny.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {
    private String timestamp;
    private int status;
    private String error;
    private String message;
    private List<ValidationErrorDetail> details;
    private String path;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ValidationErrorDetail {
        private String field;
        private String issue;
    }

    public static ApiError of(int status, String error, String message, String path) {
        return ApiError.builder()
                .timestamp(Instant.now().toString())
                .status(status)
                .error(error)
                .message(message)
                .path(path)
                .build();
    }
}
