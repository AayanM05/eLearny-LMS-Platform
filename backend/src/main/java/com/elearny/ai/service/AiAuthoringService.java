package com.elearny.ai.service;

import com.elearny.ai.dto.AiQuizDraftDto;
import com.elearny.ai.dto.GenerateQuizRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AiAuthoringService {

    public AiQuizDraftDto generateQuizDraft(GenerateQuizRequest request) {
        String topic = request.getTopic();
        List<AiQuizDraftDto.QuestionDraft> questions = new ArrayList<>();

        questions.add(AiQuizDraftDto.QuestionDraft.builder()
                .questionText("What is the primary core concept behind " + topic + "?")
                .options(List.of(
                        "Separation of concerns and modular architecture",
                        "Direct inline script execution without isolation",
                        "Single-threaded synchronous blocking calls",
                        "Manual memory deallocation in heap space"
                ))
                .correctOptionIndex(0)
                .explanation("Modern software engineering relies on modular separation of concerns.")
                .build());

        questions.add(AiQuizDraftDto.QuestionDraft.builder()
                .questionText("Which annotation or pattern is standard when working with " + topic + "?")
                .options(List.of(
                        "@Service or @Component IoC Container registration",
                        "@GlobalVariable direct binding",
                        "@ThreadBlock blocking dispatcher",
                        "System.exit(0) shutdown hook"
                ))
                .correctOptionIndex(0)
                .explanation("Spring Boot and modern frameworks utilize IoC container component scanning.")
                .build());

        if (request.getQuestionCount() > 2) {
            questions.add(AiQuizDraftDto.QuestionDraft.builder()
                    .questionText("How do you ensure optimal runtime performance when scaling " + topic + "?")
                    .options(List.of(
                            "Implementing connection pooling, async I/O, and caching layers",
                            "Increasing raw polling loops without rate limits",
                            "Storing all state in local memory arrays",
                            "Disabling security filters and CORS policy"
                    ))
                    .correctOptionIndex(0)
                    .explanation("Scalability requires connection pooling, asynchronous non-blocking I/O, and structured caching.")
                    .build());
        }

        return AiQuizDraftDto.builder()
                .topic(topic)
                .questionCount(questions.size())
                .questions(questions)
                .build();
    }
}
