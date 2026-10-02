package com.elearny.dto.request;

/** Raw webhook body is parsed as JSON in the controller; this models the fields we act on. */
public record RazorpayWebhookPayload(String event, PayloadEntity payload) {
    public record PayloadEntity(PaymentEntityWrapper payment) {}
    public record PaymentEntityWrapper(PaymentEntity entity) {}
    public record PaymentEntity(String id, String order_id, Long amount, String status) {}
}
