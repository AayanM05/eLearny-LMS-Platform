package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "coupons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Coupon extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    private LocalDate expiryDate;

    private Integer usageLimit;

    @Builder.Default
    private Integer timesUsed = 0;

    // null course_id => platform-wide (Admin-created) coupon
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @Version
    private Integer version;

    public boolean isValidNow() {
        boolean notExpired = expiryDate == null || !expiryDate.isBefore(LocalDate.now());
        boolean underLimit = usageLimit == null || timesUsed < usageLimit;
        return notExpired && underLimit;
    }
}
