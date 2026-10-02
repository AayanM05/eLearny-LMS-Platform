package com.elearny.service;

import com.elearny.dto.response.CertificateResponse;
import com.elearny.entity.*;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.CertificateRepository;
import com.elearny.repository.EnrollmentRepository;
import com.elearny.service.event.CertificateIssuedEvent;
import com.elearny.service.event.CourseCompletedEvent;
import com.elearny.util.CodeGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

/**
 * Section 7.8 (Certificate & Document Generation): FR27/FR28.
 * Listens for CourseCompletedEvent AFTER_COMMIT (Section 8.1 / Section 12.5 reliability pattern) —
 * the enrollment/progress write is never rolled back by a certificate/PDF failure.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PdfGenerationService pdfGenerationService;
    private final ApplicationEventPublisher eventPublisher;
    private final com.elearny.service.notification.NotificationDispatcher notificationDispatcher;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional
    public void onCourseCompleted(CourseCompletedEvent event) {
        Enrollment enrollment = enrollmentRepository.findById(event.enrollmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
        if (certificateRepository.findByEnrollment(enrollment).isPresent()) {
            return; // idempotent: certificate already issued
        }
        Certificate certificate = Certificate.builder()
                .enrollment(enrollment)
                .certificateCode(CodeGenerator.certificateCode())
                .issuedAt(LocalDateTime.now())
                .build();
        certificate = certificateRepository.save(certificate);
        eventPublisher.publishEvent(new CertificateIssuedEvent(certificate.getId()));
    }

    @Async("pdfExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onCertificateIssued(CertificateIssuedEvent event) {
        Certificate certificate = certificateRepository.findById(event.certificateId()).orElse(null);
        if (certificate == null) return;
        Enrollment enrollment = certificate.getEnrollment();
        User student = enrollment.getUser();
        Course course = enrollment.getCourse();

        String pdfPath = pdfGenerationService.renderAndStore("certificate.html", Map.of(
                "studentName", student.getName(),
                "courseTitle", course.getTitle(),
                "instructorName", course.getInstructor().getName(),
                "completionDate", certificate.getIssuedAt().format(DateTimeFormatter.ISO_LOCAL_DATE),
                "certificateCode", certificate.getCertificateCode()
        ), "certificates");
        certificate.setPdfUrl(pdfPath);
        certificateRepository.save(certificate);

        notificationDispatcher.dispatch(student, NotificationType.CERTIFICATE_ISSUED,
                "Your certificate is ready!",
                "Congratulations on completing \"" + course.getTitle() + "\"! Your certificate (code "
                        + certificate.getCertificateCode() + ") is ready to download.",
                "certificate:" + certificate.getId() + ":issued"); // FR27, idempotency key per Section 8.1
    }

    /** FR27: lets a student list every certificate they've earned, for their certificates page. */
    public java.util.List<CertificateResponse> myCertificates(User student) {
        return certificateRepository.findByEnrollment_UserOrderByIssuedAtDesc(student).stream()
                .map(this::toResponse).toList();
    }

    public CertificateResponse getForOwner(User requester, Long certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
        if (!certificate.getEnrollment().getUser().getId().equals(requester.getId())
                && requester.getRole() != Role.ADMIN) {
            throw new AccessDeniedCustomException("This certificate does not belong to you.");
        }
        return toResponse(certificate);
    }

    public byte[] downloadPdf(User requester, Long certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
        if (!certificate.getEnrollment().getUser().getId().equals(requester.getId())
                && requester.getRole() != Role.ADMIN) {
            throw new AccessDeniedCustomException("This certificate does not belong to you.");
        }
        if (certificate.getPdfUrl() == null) {
            throw new IllegalStateException("Certificate PDF is still being generated. Try again shortly.");
        }
        return pdfGenerationService.readPdf(certificate.getPdfUrl());
    }

    /** FR28: public verification endpoint — confirms authenticity without exposing other student data. */
    public CertificateResponse verify(String code) {
        Certificate certificate = certificateRepository.findByCertificateCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("No certificate found with this code."));
        return new CertificateResponse(null, certificate.getCertificateCode(), null, true,
                certificate.getEnrollment().getCourse().getTitle(), certificate.getEnrollment().getUser().getName());
    }

    private CertificateResponse toResponse(Certificate c) {
        return new CertificateResponse(c.getId(), c.getCertificateCode(), c.getPdfUrl(), true,
                c.getEnrollment().getCourse().getTitle(), c.getEnrollment().getUser().getName());
    }
}
