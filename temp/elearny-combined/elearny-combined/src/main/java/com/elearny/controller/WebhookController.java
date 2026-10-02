package com.elearny.controller;

import com.elearny.service.PaymentService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * FR42: Razorpay webhook — the sole source of truth for payment status (Section 12.5).
 * Public endpoint (see SecurityConfig), protected instead by HMAC signature verification.
 */
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Webhooks", description = "FR42 - Razorpay payment webhook")
public class WebhookController {

    private final PaymentService paymentService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/razorpay")
    public ResponseEntity<String> razorpayWebhook(@RequestBody String rawPayload,
                                                    @RequestHeader("X-Razorpay-Signature") String signature) {
        if (!paymentService.verifyWebhookSignature(rawPayload, signature)) {
            log.warn("Rejected Razorpay webhook with invalid signature");
            return ResponseEntity.status(400).body("invalid signature");
        }
        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            String event = root.path("event").asText();
            JsonNode paymentEntity = root.path("payload").path("payment").path("entity");
            String orderId = paymentEntity.path("order_id").asText();
            String paymentId = paymentEntity.path("id").asText();
            long amount = paymentEntity.path("amount").asLong();

            if ("payment.captured".equals(event)) {
                paymentService.handlePaymentCaptured(orderId, paymentId, amount);
            } else if ("payment.failed".equals(event)) {
                paymentService.handlePaymentFailed(orderId);
            }
            return ResponseEntity.ok("processed");
        } catch (Exception e) {
            log.error("Error processing Razorpay webhook", e);
            return ResponseEntity.status(500).body("error");
        }
    }
}
