package com.elearny.backend.media.controller;

import com.elearny.backend.media.dto.PresignedUploadResponse;
import com.elearny.backend.media.service.MediaService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/media")
@PreAuthorize("hasRole('INSTRUCTOR')")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @GetMapping("/presigned-upload-url")
    public PresignedUploadResponse getPresignedUploadUrl(
            @RequestParam String filename,
            @RequestParam String contentType
    ) {
        return mediaService.generateUploadUrl(filename, contentType);
    }
}
