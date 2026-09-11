package com.elearny.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaUploadUrlResponse {
    private String uploadUrl;
    private String publicUrl;
    private String fileKey;
    private long expiresInSeconds;
}
