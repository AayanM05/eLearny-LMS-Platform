package com.elearny.repository;

import com.elearny.entity.Payment;
import com.elearny.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentReferenceId(String referenceId);
    Optional<Payment> findByRazorpayOrderId(String orderId);
    List<Payment> findByStudentOrderByCreatedAtDesc(User student);
    boolean existsByPaymentReferenceId(String referenceId);
}
