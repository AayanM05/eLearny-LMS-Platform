package com.elearny.dto.response;

public record CertificateResponse(Long id, String certificateCode, String pdfUrl, boolean valid, String courseTitle, String studentName) {}
