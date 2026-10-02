package com.elearny.backend.media.service;

import com.elearny.backend.media.dto.PresignedUploadResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URI;
import java.time.Duration;
import java.util.UUID;

/**
 * Generates a short-lived, pre-signed URL the frontend uploads directly to
 * — the file never passes through this backend, keeping large video/PDF
 * uploads off the API server entirely. Deliberately NOT configured with
 * hard-failing @Bean creation for the S3 client — it's built lazily per
 * request instead, so missing R2 credentials produce a clean 503
 * (MediaStorageNotConfiguredException) rather than preventing the whole
 * application context from starting, matching EmailService's graceful-
 * degradation pattern for the same reason (Gmail SMTP not being configured
 * yet shouldn't crash unrelated features either).
 */
@Service
public class MediaService {

    private final String endpoint;
    private final String accessKey;
    private final String secretKey;
    private final String bucket;
    private final String publicBaseUrl;

    public MediaService(
            @Value("${elearny.r2.endpoint:}") String endpoint,
            @Value("${elearny.r2.access-key:}") String accessKey,
            @Value("${elearny.r2.secret-key:}") String secretKey,
            @Value("${elearny.r2.bucket:elearny-media}") String bucket,
            @Value("${elearny.r2.public-base-url:}") String publicBaseUrl
    ) {
        this.endpoint = endpoint;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.bucket = bucket;
        this.publicBaseUrl = publicBaseUrl;
    }

    public PresignedUploadResponse generateUploadUrl(String originalFilename, String contentType) {
        if (endpoint.isBlank() || accessKey.isBlank() || secretKey.isBlank()) {
            throw new MediaStorageNotConfiguredException();
        }

        String objectKey = "uploads/" + UUID.randomUUID() + "-" + sanitizeFilename(originalFilename);

        try (S3Presigner presigner = buildPresigner()) {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectKey)
                    .contentType(contentType)
                    .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(15))
                    .putObjectRequest(putRequest)
                    .build();

            String uploadUrl = presigner.presignPutObject(presignRequest).url().toString();
            String publicUrl = (publicBaseUrl.isBlank() ? endpoint + "/" + bucket : publicBaseUrl) + "/" + objectKey;

            return new PresignedUploadResponse(uploadUrl, publicUrl, objectKey);
        }
    }

    private S3Presigner buildPresigner() {
        return S3Presigner.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of("auto")) // R2 doesn't use AWS regions, but the SDK requires a value
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    private String sanitizeFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return "file";
        }
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
