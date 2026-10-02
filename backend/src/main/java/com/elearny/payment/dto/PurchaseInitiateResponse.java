package com.elearny.payment.dto;

public record PurchaseInitiateResponse(String razorpayOrderId, String razorpayKeyId, long amountInPaise, String currency) {}
