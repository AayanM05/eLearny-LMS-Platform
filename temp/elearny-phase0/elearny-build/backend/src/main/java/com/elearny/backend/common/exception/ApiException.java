package com.elearny.backend.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Base class for every deliberately-thrown application exception. Domain
 * exceptions (e.g. a future `InvalidCouponException` in Phase 3) should
 * extend this rather than throwing raw RuntimeExceptions, so
 * GlobalExceptionHandler can always resolve a correct HTTP status.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
