package com.elearny.controller;

import com.elearny.dto.request.PurchaseInitiateRequest;
import com.elearny.dto.response.PurchaseInitiateResponse;
import com.elearny.service.PaymentService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "FR41-FR43")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/courses/{courseId}/initiate")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<PurchaseInitiateResponse> initiate(@PathVariable Long courseId, @RequestBody(required = false) PurchaseInitiateRequest req) {
        String coupon = req != null ? req.couponCode() : null;
        return ResponseEntity.ok(paymentService.initiatePurchase(SecurityUtils.currentUser(), courseId, coupon));
    }
}
