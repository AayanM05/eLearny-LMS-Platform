package com.elearny.service;

import com.elearny.entity.*;
import com.elearny.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Section 7.26 (Data Privacy): FR64-FR66. Account deletion ANONYMIZES rather than hard-deletes,
 * because certificates must remain independently verifiable (FR28) even after the holder
 * deletes their account — hard-deleting the User would break every certificate they ever earned.
 */
@Service
@RequiredArgsConstructor
public class DataPrivacyService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;
    private final CertificateRepository certificateRepository;
    private final AuditService auditService;
    private final RefreshTokenService refreshTokenService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @SneakyThrows
    public String exportUserData(User user) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserAndRevokedFalse(user);
        List<Payment> payments = paymentRepository.findByStudentOrderByCreatedAtDesc(user);
        Map<String, Object> export = Map.of(
                "profile", Map.of("name", user.getName(), "email", user.getEmail(), "phone", user.getPhone(), "role", user.getRole()),
                "enrollments", enrollments.stream().map(e -> e.getCourse().getTitle()).toList(),
                "payments", payments.stream().map(p -> Map.of("course", p.getCourse().getTitle(), "amount", p.getAmount(), "status", p.getStatus())).toList()
        );
        auditService.log(user, "DATA_EXPORT_REQUESTED", "User", user.getId(), null); // FR66 audit trail
        return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(export);
    }

    @Transactional
    public void anonymizeAccount(User user) {
        String anonId = UUID.randomUUID().toString().substring(0, 8);
        user.setName("Deleted User " + anonId);
        user.setEmail("deleted-" + anonId + "@elearny.invalid");
        user.setPhone("0000000000");
        user.setPassword("");
        user.setActive(false);
        user.setAnonymized(true); // FR65: certificates remain verifiable, but no PII resolves back to this record
        userRepository.save(user);
        refreshTokenService.revokeAllForUser(user);
        auditService.log(user, "ACCOUNT_ANONYMIZED", "User", user.getId(), null);
    }
}
