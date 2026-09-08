package com.elearny.certificate.repository;

import com.elearny.certificate.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    Optional<Certificate> findByCertificateCode(String certificateCode);
    Optional<Certificate> findByUserIdAndCourseId(UUID userId, UUID courseId);
    List<Certificate> findByUserIdOrderByIssuedAtDesc(UUID userId);
}
