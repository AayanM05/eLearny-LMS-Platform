package com.elearny.backend.instructor.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class InvalidActivationTokenException extends ApiException {
    public InvalidActivationTokenException() {
        super(HttpStatus.BAD_REQUEST, "This setup link is invalid or has expired. Contact support.");
    }
}
