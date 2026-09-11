package com.elearny.service;

import com.elearny.dto.MediaUploadUrlRequest;
import com.elearny.dto.MediaUploadUrlResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaService {

    @Value("${app.storage.cdn-url:https://cdn.elearny.com}")
    private String cdnBaseUrl;

    public MediaUploadUrlResponse generateUploadUrl(String username, MediaUploadUrlRequest request) {
        String category = request.getFileCategory() != null ? request.getFileCategory() : "general";
        String fileExtension = "";
        int dotIndex = request.getFileName().lastIndexOf(".");
        if (dotIndex >= 0) {
            fileExtension = request.getFileName().substring(dotIndex);
        }

        String fileKey = category + "/" + username + "/" + UUID.randomUUID() + fileExtension;
        
        // Mock pre-signed URL signature for client upload
        String uploadUrl = cdnBaseUrl + "/upload/" + fileKey + "?signature=" + UUID.randomUUID();
        String publicUrl = cdnBaseUrl + "/files/" + fileKey;

        return MediaUploadUrlResponse.builder()
                .uploadUrl(uploadUrl)
                .publicUrl(publicUrl)
                .fileKey(fileKey)
                .expiresInSeconds(3600)
                .build();
    }
}
