package com.elearny.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveSessionSlotResponse {
    private Long id;
    private Long instructorId;
    private String instructorName;
    private Long courseId;
    private String courseTitle;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int maxCapacity;
    private long bookedCount;
    private String meetingLink;
    private String status;
    private LocalDateTime createdAt;
}
