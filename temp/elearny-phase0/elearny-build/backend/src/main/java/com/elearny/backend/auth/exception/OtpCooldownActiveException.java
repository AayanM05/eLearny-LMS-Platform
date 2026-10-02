package com.elearny.backend.auth.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class OtpCooldownActiveException extends ApiException {
    public OtpCooldownActiveException(long secondsRemaining) {
        super(HttpStatus.TOO_MANY_REQUESTS, "Please wait " + secondsRemaining + " seconds before requesting another code");
    }
}
