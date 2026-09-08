package com.elearny.payment.repository;

import com.elearny.payment.entity.Order;
import com.elearny.payment.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByCourseInstructorIdAndStatus(UUID instructorId, OrderStatus status);
}
