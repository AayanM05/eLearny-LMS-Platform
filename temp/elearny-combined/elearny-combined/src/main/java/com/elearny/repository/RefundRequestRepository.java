package com.elearny.repository;

import com.elearny.entity.Payment;
import com.elearny.entity.RefundRequest;
import com.elearny.entity.RefundStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefundRequestRepository extends JpaRepository<RefundRequest, Long> {
    List<RefundRequest> findByStatus(RefundStatus status);
    Optional<RefundRequest> findByPayment(Payment payment);
}
