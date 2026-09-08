package com.elearny.certificate.controller;

import com.elearny.certificate.dto.CertificateResponse;
import com.elearny.certificate.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping("/issue")
    public ResponseEntity<CertificateResponse> issueCertificate(
            @AuthenticationPrincipal String userId,
            @RequestParam UUID courseId) {
        CertificateResponse response = certificateService.issueCertificate(UUID.fromString(userId), courseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-certificates")
    public ResponseEntity<List<CertificateResponse>> getMyCertificates(@AuthenticationPrincipal String userId) {
        List<CertificateResponse> certificates = certificateService.getUserCertificates(UUID.fromString(userId));
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/verify/{code}")
    public ResponseEntity<CertificateResponse> verifyCertificate(@PathVariable String code) {
        CertificateResponse response = certificateService.verifyCertificate(code);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{code}")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable String code) throws IOException {
        byte[] pdfBytes = certificateService.generatePdf(code);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"certificate-" + code + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
