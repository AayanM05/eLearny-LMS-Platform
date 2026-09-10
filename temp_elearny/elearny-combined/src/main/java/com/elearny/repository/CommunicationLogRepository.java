package com.elearny.repository;

import com.elearny.entity.CommunicationLog;
import com.elearny.entity.CommunicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommunicationLogRepository extends JpaRepository<CommunicationLog, Long> {
    Optional<CommunicationLog> findByIdempotencyKey(String idempotencyKey);
    Page<CommunicationLog> findByStatus(CommunicationStatus status, Pageable pageable);
    long countByStatus(CommunicationStatus status);
}
