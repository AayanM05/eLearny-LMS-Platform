package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "refund_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RefundRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @Lob
    private String reason;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RefundStatus status = RefundStatus.REQUESTED;

    @Lob
    private String adminNotes;

    private LocalDateTime requestedAt;

    private LocalDateTime resolvedAt;
}
