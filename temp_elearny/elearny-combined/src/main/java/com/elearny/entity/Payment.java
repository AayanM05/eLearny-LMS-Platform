package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", unique = true)
    private Enrollment enrollment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    @Column(name = "payment_reference_id", unique = true)
    private String paymentReferenceId;

    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Builder.Default
    private String gateway = "RAZORPAY";

    private LocalDateTime paidAt;

    private String receiptPdfUrl;
}
