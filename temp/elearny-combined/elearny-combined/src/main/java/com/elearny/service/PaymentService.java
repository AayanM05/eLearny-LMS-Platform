package com.elearny.service;

import com.elearny.dto.response.PurchaseInitiateResponse;
import com.elearny.entity.*;
import com.elearny.exception.BusinessRuleException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.PaymentRepository;
import com.elearny.service.event.PaymentCapturedEvent;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Section 7.14 (Payment Integration): FR41-FR43.
 * CRITICAL invariant (Section 12.5): the Razorpay webhook — signature-verified and idempotent on
 * payment_reference_id — is the sole source of truth for "did this payment succeed". The frontend's
 * post-checkout callback is only used to redirect the UI; it never itself marks a payment CAPTURED.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CourseService courseService;
    private final CouponService couponService;
    private final EnrollmentService enrollmentService;
    private final ApplicationEventPublisher eventPublisher;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;
    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;
    @Value("${razorpay.webhook-secret}")
    private String webhookSecret;

    @Transactional
    public PurchaseInitiateResponse initiatePurchase(User student, Long courseId, String couponCode) {
        Course course = courseService.findEntity(courseId);
        BigDecimal amount = course.getPrice();
        Coupon coupon = null;
        if (couponCode != null && !couponCode.isBlank()) {
            coupon = couponService.getValidCouponOrThrow(couponCode, course);
            amount = couponService.computeDiscountedPrice(course.getPrice(), coupon);
        }
        long amountInPaise = amount.setScale(2, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).longValueExact();

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "eln-" + UUID.randomUUID());
            var order = client.orders.create(orderRequest);
            String orderId = order.get("id");

            Payment payment = Payment.builder()
                    .student(student).course(course).amount(amount).coupon(coupon)
                    .razorpayOrderId(orderId).status(PaymentStatus.CREATED).build();
            paymentRepository.save(payment);

            return new PurchaseInitiateResponse(orderId, razorpayKeyId, amountInPaise, "INR");
        } catch (Exception e) {
            throw new IllegalStateException("Failed to create Razorpay order: " + e.getMessage(), e);
        }
    }

    /** FR42: verifies the HMAC-SHA256 signature Razorpay sends with every webhook call before trusting the body. */
    public boolean verifyWebhookSignature(String payload, String signatureHeader) {
        try {
            // CRITICAL: Utils.verifyWebhookSignature returns false on a mismatch — it does NOT throw
            // for "signature doesn't match," only for actual processing errors. The return value must
            // be captured and checked; treating "no exception" as "verified" would accept forged webhooks.
            return Utils.verifyWebhookSignature(payload, signatureHeader, webhookSecret);
        } catch (Exception e) {
            log.warn("Webhook signature verification threw an exception (treated as invalid): {}", e.getMessage());
            return false;
        }
    }

    /**
     * FR42/FR43: idempotent on razorpayPaymentId (== payment_reference_id) — Razorpay may deliver the
     * same webhook event more than once, and this must never double-enroll or double-charge.
     */
    @Transactional
    @Retryable(retryFor = ObjectOptimisticLockingFailureException.class, maxAttempts = 3, backoff = @Backoff(delay = 200))
    public void handlePaymentCaptured(String razorpayOrderId, String razorpayPaymentId, long amountPaise) {
        if (paymentRepository.existsByPaymentReferenceId(razorpayPaymentId)) {
            log.info("Duplicate webhook delivery for payment {}, ignoring.", razorpayPaymentId);
            return; // already processed - idempotent no-op
        }
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("No payment record for Razorpay order " + razorpayOrderId));
        if (payment.getStatus() == PaymentStatus.CAPTURED) {
            return;
        }
        payment.setPaymentReferenceId(razorpayPaymentId);
        payment.setStatus(PaymentStatus.CAPTURED);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        if (payment.getCoupon() != null) {
            couponService.incrementUsage(payment.getCoupon());
        }
        Enrollment enrollment = enrollmentService.enrollAfterPayment(payment.getStudent(), payment.getCourse());
        payment.setEnrollment(enrollment);
        paymentRepository.save(payment);

        eventPublisher.publishEvent(new PaymentCapturedEvent(payment.getId()));
    }

    @Transactional
    public void handlePaymentFailed(String razorpayOrderId) {
        paymentRepository.findByRazorpayOrderId(razorpayOrderId).ifPresent(p -> {
            if (p.getStatus() == PaymentStatus.CREATED) {
                p.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(p);
            }
        });
    }

    public Payment findById(Long id) {
        return paymentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }
}
