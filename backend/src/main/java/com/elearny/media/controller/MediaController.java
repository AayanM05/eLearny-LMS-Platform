package com.elearny.media.controller;

import com.elearny.media.dto.UploadUrlRequest;
import com.elearny.media.dto.UploadUrlResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
public class MediaController {

    @Value("${media.public-base-url:https://cdn.elearny.com}")
    private String cdnBaseUrl;

    @PostMapping("/upload-url")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<UploadUrlResponse> getUploadUrl(@Valid @RequestBody UploadUrlRequest request) {
        String folder = request.getFolder() != null ? request.getFolder() : "uploads";
        String fileKey = folder + "/" + UUID.randomUUID() + "-" + request.getFileName();
        String publicUrl = cdnBaseUrl + "/" + fileKey;

        // Mock upload URL for development/direct upload simulation
        String uploadUrl = cdnBaseUrl + "/upload/" + fileKey;

        UploadUrlResponse response = UploadUrlResponse.builder()
                .uploadUrl(uploadUrl)
                .publicUrl(publicUrl)
                .fileKey(fileKey)
                .build();

        return ResponseEntity.ok(response);
    }
}
