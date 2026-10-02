package com.elearny.certificate.dto;

public record CertificateResponse(Long id, String certificateCode, String pdfUrl, boolean valid, String courseTitle, String studentName) {}
