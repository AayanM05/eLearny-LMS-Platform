package com.elearny.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiQuizDraftDto {
    private String topic;
    private int questionCount;
    private List<QuestionDraft> questions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDraft {
        private String questionText;
        private List<String> options;
        private int correctOptionIndex;
        private String explanation;
    }
}
