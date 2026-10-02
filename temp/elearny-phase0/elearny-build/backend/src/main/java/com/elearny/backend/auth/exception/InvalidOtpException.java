package com.elearny.backend.auth.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class InvalidOtpException extends ApiException {
    public InvalidOtpException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}
