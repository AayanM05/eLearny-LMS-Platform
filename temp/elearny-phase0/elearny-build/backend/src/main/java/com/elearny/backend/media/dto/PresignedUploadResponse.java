package com.elearny.backend.media.dto;

public record PresignedUploadResponse(
        String uploadUrl,  // PUT here to upload the file directly to R2
        String publicUrl,  // store THIS in the course/lesson record — where the file will be readable from once uploaded
        String objectKey
) {
}
