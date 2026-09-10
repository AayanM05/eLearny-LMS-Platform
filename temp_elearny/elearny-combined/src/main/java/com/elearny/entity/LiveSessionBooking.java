package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "live_session_bookings", uniqueConstraints = @UniqueConstraint(columnNames = {"slot_id", "student_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LiveSessionBooking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private LiveSessionSlot slot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BookingStatus status = BookingStatus.CONFIRMED;

    private String meetingLink;
}
