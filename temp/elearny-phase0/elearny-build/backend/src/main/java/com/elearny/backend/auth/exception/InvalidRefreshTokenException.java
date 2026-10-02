package com.elearny.backend.auth.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class InvalidRefreshTokenException extends ApiException {
    public InvalidRefreshTokenException() {
        super(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token — please log in again");
    }
}
