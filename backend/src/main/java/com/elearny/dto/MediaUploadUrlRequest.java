package com.elearny.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaUploadUrlRequest {
    @NotBlank(message = "Filename is required")
    private String fileName;

    @NotBlank(message = "Content type is required")
    private String contentType;

    private String fileCategory; // 'course_thumbnail', 'lesson_video', 'lesson_doc', 'resume'
}
