package com.elearny.exception;

/** Thrown when a request violates a business invariant (e.g. duplicate enrollment, expired coupon). */
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message);
    }
}
