package com.elearny.controller;

import com.elearny.dto.*;
import com.elearny.entity.InstructorLeave;
import com.elearny.service.InstructorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/instructor")
@RequiredArgsConstructor
public class InstructorController {

    private final InstructorService instructorService;

    @PostMapping("/applications")
    public ResponseEntity<ApiResponse<InstructorApplicationResponse>> apply(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody InstructorApplicationRequest request) {
        InstructorApplicationResponse response = instructorService.applyForInstructor(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Instructor application submitted successfully"));
    }

    @GetMapping("/applications/me")
    public ResponseEntity<ApiResponse<InstructorApplicationResponse>> getMyApplication(
            @AuthenticationPrincipal UserDetails userDetails) {
        InstructorApplicationResponse response = instructorService.getMyApplication(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response, "Instructor application retrieved successfully"));
    }

    @PostMapping("/leave")
    public ResponseEntity<ApiResponse<InstructorLeave>> addLeave(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody InstructorLeaveRequest request) {
        InstructorLeave response = instructorService.addLeave(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Leave schedule recorded successfully"));
    }

    @GetMapping("/leave")
    public ResponseEntity<ApiResponse<List<InstructorLeave>>> getMyLeaves(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<InstructorLeave> response = instructorService.getMyLeaves(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response, "Instructor leaves retrieved successfully"));
    }

    @PostMapping("/live-slots")
    public ResponseEntity<ApiResponse<LiveSessionSlotResponse>> createLiveSlot(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody LiveSessionSlotRequest request) {
        LiveSessionSlotResponse response = instructorService.createLiveSlot(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Live session slot created successfully"));
    }

    @GetMapping("/live-slots")
    public ResponseEntity<ApiResponse<List<LiveSessionSlotResponse>>> getMyLiveSlots(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<LiveSessionSlotResponse> response = instructorService.getMyLiveSlots(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response, "Live session slots retrieved successfully"));
    }
}
