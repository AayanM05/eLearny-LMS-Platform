package com.elearny.dto.response;

public record PurchaseInitiateResponse(String razorpayOrderId, String razorpayKeyId, long amountInPaise, String currency) {}
