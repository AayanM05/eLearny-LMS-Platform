package com.elearny.payment.controller;

import com.elearny.payment.dto.CreateOrderRequest;
import com.elearny.payment.dto.OrderResponse;
import com.elearny.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<OrderResponse> createOrder(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody CreateOrderRequest request) {
        OrderResponse response = paymentService.createOrder(UUID.fromString(userId), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<OrderResponse> verifyPayment(
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpayPaymentId) {
        OrderResponse response = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId);
        return ResponseEntity.ok(response);
    }
}
