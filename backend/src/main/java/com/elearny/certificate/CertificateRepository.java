package com.elearny.certificate;

import com.elearny.enrollment.Enrollment;
import com.elearny.user.User;








import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByEnrollment(Enrollment enrollment);
    Optional<Certificate> findByCertificateCode(String code);
    java.util.List<Certificate> findByEnrollment_UserOrderByIssuedAtDesc(com.elearny.user.User user);
}
