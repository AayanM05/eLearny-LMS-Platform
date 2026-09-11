package com.elearny.controller;

import com.elearny.dto.ApiResponse;
import com.elearny.dto.MediaUploadUrlRequest;
import com.elearny.dto.MediaUploadUrlResponse;
import com.elearny.service.MediaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
public class MediaUploadController {

    private final MediaService mediaService;

    @PostMapping("/upload-url")
    public ResponseEntity<ApiResponse<MediaUploadUrlResponse>> getUploadUrl(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody MediaUploadUrlRequest request) {
        MediaUploadUrlResponse response = mediaService.generateUploadUrl(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Upload URL generated successfully"));
    }
}
