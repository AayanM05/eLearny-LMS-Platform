package com.elearny.certificate.service;

import com.elearny.certificate.dto.CertificateResponse;
import com.elearny.certificate.entity.Certificate;
import com.elearny.certificate.repository.CertificateRepository;
import com.elearny.course.entity.Course;
import com.elearny.course.repository.CourseRepository;
import com.elearny.user.entity.User;
import com.elearny.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    @Transactional
    public CertificateResponse issueCertificate(UUID userId, UUID courseId) {
        return certificateRepository.findByUserIdAndCourseId(userId, courseId)
                .map(this::mapToResponse)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
                    Course course = courseRepository.findById(courseId)
                            .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));

                    String code = "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

                    Certificate cert = Certificate.builder()
                            .user(user)
                            .course(course)
                            .certificateCode(code)
                            .build();

                    Certificate saved = certificateRepository.save(cert);
                    return mapToResponse(saved);
                });
    }

    @Transactional(readOnly = true)
    public CertificateResponse verifyCertificate(String code) {
        Certificate cert = certificateRepository.findByCertificateCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Invalid certificate code: " + code));
        return mapToResponse(cert);
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> getUserCertificates(UUID userId) {
        return certificateRepository.findByUserIdOrderByIssuedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public byte[] generatePdf(String code) throws IOException {
        Certificate cert = certificateRepository.findByCertificateCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found: " + code));

        try (PDDocument document = new PDDocument()) {
            PDRectangle landscapeA4 = new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth());
            PDPage page = new PDPage(landscapeA4);
            document.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                PDType1Font titleFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font bodyFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

                // Draw title
                content.beginText();
                content.setFont(titleFont, 32);
                content.newLineAtOffset(200, 500);
                content.showText("CERTIFICATE OF COMPLETION");
                content.endText();

                // Subtitle
                content.beginText();
                content.setFont(bodyFont, 16);
                content.newLineAtOffset(280, 450);
                content.showText("This is proudly presented to");
                content.endText();

                // Recipient Name
                content.beginText();
                content.setFont(titleFont, 24);
                content.newLineAtOffset(250, 400);
                content.showText(cert.getUser().getFullName());
                content.endText();

                // Completion message
                content.beginText();
                content.setFont(bodyFont, 14);
                content.newLineAtOffset(220, 350);
                content.showText("For successfully completing the online course");
                content.endText();

                // Course Title
                content.beginText();
                content.setFont(titleFont, 18);
                content.newLineAtOffset(220, 310);
                content.showText(cert.getCourse().getTitle());
                content.endText();

                // Details: Date & Code
                String formattedDate = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
                        .withZone(ZoneId.systemDefault())
                        .format(cert.getIssuedAt());

                content.beginText();
                content.setFont(bodyFont, 12);
                content.newLineAtOffset(100, 200);
                content.showText("Issued On: " + formattedDate);
                content.endText();

                content.beginText();
                content.setFont(bodyFont, 12);
                content.newLineAtOffset(100, 180);
                content.showText("Certificate ID: " + cert.getCertificateCode());
                content.endText();

                content.beginText();
                content.setFont(bodyFont, 12);
                content.newLineAtOffset(100, 160);
                content.showText("Verify at: " + baseUrl + "/verify-certificate/" + cert.getCertificateCode());
                content.endText();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }

    private CertificateResponse mapToResponse(Certificate cert) {
        return CertificateResponse.builder()
                .id(cert.getId())
                .userId(cert.getUser().getId())
                .recipientName(cert.getUser().getFullName())
                .courseId(cert.getCourse().getId())
                .courseTitle(cert.getCourse().getTitle())
                .instructorName(cert.getCourse().getInstructor().getFullName())
                .certificateCode(cert.getCertificateCode())
                .verificationUrl(baseUrl + "/verify-certificate/" + cert.getCertificateCode())
                .issuedAt(cert.getIssuedAt())
                .build();
    }
}
