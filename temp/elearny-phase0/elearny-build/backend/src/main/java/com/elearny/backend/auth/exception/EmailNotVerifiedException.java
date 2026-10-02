package com.elearny.backend.auth.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class EmailNotVerifiedException extends ApiException {
    public EmailNotVerifiedException() {
        super(HttpStatus.FORBIDDEN, "Please verify your email before logging in");
    }
}
