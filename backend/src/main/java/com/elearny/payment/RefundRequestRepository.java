package com.elearny.payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefundRequestRepository extends JpaRepository<RefundRequest, Long> {
    List<RefundRequest> findByStatus(RefundStatus status);
    Optional<RefundRequest> findByPayment(Payment payment);
}
