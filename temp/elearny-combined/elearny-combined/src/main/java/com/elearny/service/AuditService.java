package com.elearny.service;

import com.elearny.entity.AuditLog;
import com.elearny.entity.User;
import com.elearny.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * FR54/FR66: immutable audit trail on User, Payment, Certificate, RefundRequest, Course,
 * and every data-export/deletion request. Insert-only at the application level (NFR - Auditability).
 */
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void log(User actor, String action, String entityType, Long entityId, String detailsJson) {
        AuditLog entry = AuditLog.builder()
                .user(actor)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .detailsJson(detailsJson)
                .build();
        auditLogRepository.save(entry);
    }
}
