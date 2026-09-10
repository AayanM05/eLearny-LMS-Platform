package com.elearny.repository;

import com.elearny.entity.Certificate;
import com.elearny.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByEnrollment(Enrollment enrollment);
    Optional<Certificate> findByCertificateCode(String code);
    java.util.List<Certificate> findByEnrollment_UserOrderByIssuedAtDesc(com.elearny.entity.User user);
}
