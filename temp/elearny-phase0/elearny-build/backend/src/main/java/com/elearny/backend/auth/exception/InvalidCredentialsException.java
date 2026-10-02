package com.elearny.backend.auth.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends ApiException {
    public InvalidCredentialsException() {
        // Deliberately identical whether the username doesn't exist or the
        // password is wrong — never confirm which one via the message.
        super(HttpStatus.UNAUTHORIZED, "Incorrect username/email or password");
    }
}
