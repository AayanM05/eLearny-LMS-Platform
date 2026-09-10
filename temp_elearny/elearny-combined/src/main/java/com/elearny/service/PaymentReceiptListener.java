package com.elearny.service;

import com.elearny.entity.NotificationType;
import com.elearny.entity.Payment;
import com.elearny.repository.PaymentRepository;
import com.elearny.service.event.PaymentCapturedEvent;
import com.elearny.service.notification.NotificationDispatcher;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/** Generates the payment receipt PDF and dispatches the enrollment-confirmation notification, AFTER_COMMIT. */
@Service
@RequiredArgsConstructor
public class PaymentReceiptListener {

    private final PaymentRepository paymentRepository;
    private final PdfGenerationService pdfGenerationService;
    private final NotificationDispatcher notificationDispatcher;

    @Async("pdfExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPaymentCaptured(PaymentCapturedEvent event) {
        Payment payment = paymentRepository.findById(event.paymentId()).orElse(null);
        if (payment == null) return;

        Map<String, Object> vars = new HashMap<>();
        vars.put("studentName", payment.getStudent().getName());
        vars.put("courseTitle", payment.getCourse().getTitle());
        vars.put("amount", payment.getAmount().toPlainString());
        vars.put("couponCode", payment.getCoupon() != null ? payment.getCoupon().getCode() : null);
        vars.put("paymentReferenceId", payment.getPaymentReferenceId());
        vars.put("paidAt", payment.getPaidAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        String pdfPath = pdfGenerationService.renderAndStore("receipt.html", vars, "receipts");
        payment.setReceiptPdfUrl(pdfPath);
        paymentRepository.save(payment);

        notificationDispatcher.dispatch(payment.getStudent(), NotificationType.ENROLLMENT_CONFIRMATION,
                "You're enrolled in " + payment.getCourse().getTitle() + "!",
                "Your payment of " + payment.getAmount() + " was successful. Your receipt is attached to your account.",
                "payment:" + payment.getId() + ":confirmed");
    }
}
