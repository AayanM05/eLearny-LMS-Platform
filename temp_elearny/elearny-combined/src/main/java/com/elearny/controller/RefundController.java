package com.elearny.controller;

import com.elearny.dto.request.RefundDecisionRequest;
import com.elearny.dto.request.RefundRequestCreate;
import com.elearny.dto.response.RefundEligibilityResponse;
import com.elearny.dto.response.RefundRequestResponse;
import com.elearny.service.RefundService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/refunds")
@RequiredArgsConstructor
@Tag(name = "Refunds", description = "FR33-FR35")
public class RefundController {

    private final RefundService refundService;

    /** UI spec S13: called before showing the refund request form, so the student sees eligibility
     *  (or the specific reason it's unavailable) immediately rather than after submitting. */
    @GetMapping("/payments/{paymentId}/eligibility")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<RefundEligibilityResponse> eligibility(@PathVariable Long paymentId) {
        return ResponseEntity.ok(refundService.checkEligibility(SecurityUtils.currentUser(), paymentId));
    }

    @PostMapping("/payments/{paymentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<RefundRequestResponse> request(@PathVariable Long paymentId, @Valid @RequestBody RefundRequestCreate req) {
        return ResponseEntity.ok(refundService.request(SecurityUtils.currentUser(), paymentId, req));
    }

    @PostMapping("/{refundRequestId}/decide")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RefundRequestResponse> decide(@PathVariable Long refundRequestId, @Valid @RequestBody RefundDecisionRequest req) {
        return ResponseEntity.ok(refundService.decide(SecurityUtils.currentUser(), refundRequestId, req));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<java.util.List<RefundRequestResponse>> pending() {
        return ResponseEntity.ok(refundService.pending());
    }
}
