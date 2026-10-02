package com.elearny.common.exception;

public class AccessDeniedCustomException extends RuntimeException {
    public AccessDeniedCustomException(String message) {
        super(message);
    }
}
