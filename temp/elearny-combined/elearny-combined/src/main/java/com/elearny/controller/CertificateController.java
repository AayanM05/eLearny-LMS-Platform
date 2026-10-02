package com.elearny.controller;

import com.elearny.dto.response.CertificateResponse;
import com.elearny.service.CertificateService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@Tag(name = "Certificates", description = "FR27/FR28")
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(certificateService.getForOwner(SecurityUtils.currentUser(), id));
    }

    @GetMapping("/mine")
    public ResponseEntity<java.util.List<CertificateResponse>> mine() {
        return ResponseEntity.ok(certificateService.myCertificates(SecurityUtils.currentUser()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        byte[] pdf = certificateService.downloadPdf(SecurityUtils.currentUser(), id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/verify/{code}")
    public ResponseEntity<CertificateResponse> verify(@PathVariable String code) {
        return ResponseEntity.ok(certificateService.verify(code));
    }
}
