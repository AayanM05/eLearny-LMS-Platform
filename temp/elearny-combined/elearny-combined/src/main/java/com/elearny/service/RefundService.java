package com.elearny.service;

import com.elearny.dto.request.RefundDecisionRequest;
import com.elearny.dto.request.RefundRequestCreate;
import com.elearny.dto.response.RefundEligibilityResponse;
import com.elearny.dto.response.RefundRequestResponse;
import com.elearny.entity.*;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.BusinessRuleException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.PaymentRepository;
import com.elearny.repository.RefundRequestRepository;
import com.elearny.service.notification.NotificationDispatcher;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Section 7.13 (Refund): FR33-FR35. Manual Admin review workflow, not automatic gateway refund.
 * UI spec S13/AD3: eligibility is gated by a policy window — both a time limit since purchase AND
 * a progress cap, matching the spec's "policy window (days since purchase, progress %)" language.
 * checkEligibility() is a preview the frontend calls before showing the request form; request()
 * re-derives and enforces the exact same rule server-side, since a client-side check alone is
 * never the real security/business boundary.
 */
@Service
@RequiredArgsConstructor
public class RefundService {

    private final RefundRequestRepository refundRequestRepository;
    private final PaymentRepository paymentRepository;
    private final EnrollmentService enrollmentService;
    private final ProgressService progressService;
    private final NotificationDispatcher notificationDispatcher;

    @Value("${app.refund.window-days:7}")
    private int refundWindowDays;

    @Value("${app.refund.max-progress-percent:30}")
    private double refundMaxProgressPercent;

    public RefundEligibilityResponse checkEligibility(User student, Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        if (!payment.getStudent().getId().equals(student.getId())) {
            throw new AccessDeniedCustomException("This payment does not belong to you.");
        }
        return computeEligibility(payment);
    }

    private RefundEligibilityResponse computeEligibility(Payment payment) {
        LocalDateTime windowExpiresAt = payment.getPaidAt() != null ? payment.getPaidAt().plusDays(refundWindowDays) : null;
        double progressPercent = progressService.getProgress(payment.getStudent(), payment.getCourse()).percent();

        String reason = null;
        if (payment.getStatus() != PaymentStatus.CAPTURED) {
            reason = "Only captured payments are eligible for a refund.";
        } else if (refundRequestRepository.findByPayment(payment).isPresent()) {
            reason = "A refund request already exists for this payment.";
        } else if (windowExpiresAt != null && LocalDateTime.now().isAfter(windowExpiresAt)) {
            reason = "The " + refundWindowDays + "-day refund window has passed.";
        } else if (progressPercent > refundMaxProgressPercent) {
            reason = "You've completed too much of this course to qualify for a refund (over "
                    + (int) refundMaxProgressPercent + "% complete).";
        }

        return new RefundEligibilityResponse(reason == null, reason, windowExpiresAt, progressPercent, refundMaxProgressPercent);
    }

    @Transactional
    public RefundRequestResponse request(User student, Long paymentId, RefundRequestCreate req) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        if (!payment.getStudent().getId().equals(student.getId())) {
            throw new AccessDeniedCustomException("This payment does not belong to you.");
        }
        RefundEligibilityResponse eligibility = computeEligibility(payment);
        if (!eligibility.eligible()) {
            throw new BusinessRuleException(eligibility.reasonIfNotEligible());
        }
        RefundRequest refundRequest = RefundRequest.builder()
                .payment(payment).reason(req.reason()).status(RefundStatus.REQUESTED)
                .requestedAt(LocalDateTime.now()).build();
        refundRequest = refundRequestRepository.save(refundRequest);
        return toResponse(refundRequest);
    }

    public java.util.List<RefundRequestResponse> pending() {
        return refundRequestRepository.findByStatus(RefundStatus.REQUESTED).stream()
                .map(this::toResponse).toList();
    }

    @Transactional
    public RefundRequestResponse decide(User admin, Long refundRequestId, RefundDecisionRequest decision) {
        RefundRequest refundRequest = refundRequestRepository.findById(refundRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Refund request not found"));
        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedCustomException("Only Admins can decide refund requests."); // FR34
        }
        refundRequest.setAdminNotes(decision.adminNotes());
        refundRequest.setResolvedAt(LocalDateTime.now());

        if (Boolean.TRUE.equals(decision.approve())) {
            refundRequest.setStatus(RefundStatus.APPROVED);
            Payment payment = refundRequest.getPayment();
            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
            if (payment.getEnrollment() != null) {
                enrollmentService.revoke(payment.getEnrollment()); // FR35: revoke course access
            }
            refundRequest.setStatus(RefundStatus.SETTLED);
        } else {
            refundRequest.setStatus(RefundStatus.REJECTED);
        }
        refundRequest = refundRequestRepository.save(refundRequest);

        notificationDispatcher.dispatch(refundRequest.getPayment().getStudent(), NotificationType.REFUND_STATUS,
                "Your refund request has been " + refundRequest.getStatus(),
                decision.adminNotes(),
                "refund:" + refundRequest.getId() + ":" + refundRequest.getStatus());

        return toResponse(refundRequest);
    }

    private RefundRequestResponse toResponse(RefundRequest r) {
        return new RefundRequestResponse(r.getId(), r.getPayment().getId(), r.getReason(), r.getStatus(), r.getAdminNotes(),
                r.getPayment().getStudent().getName(), r.getPayment().getCourse().getTitle(), r.getPayment().getAmount());
    }
}
