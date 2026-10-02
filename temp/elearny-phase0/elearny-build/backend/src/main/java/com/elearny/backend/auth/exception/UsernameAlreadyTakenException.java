package com.elearny.backend.auth.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class UsernameAlreadyTakenException extends ApiException {
    public UsernameAlreadyTakenException(String username) {
        super(HttpStatus.CONFLICT, "Username '" + username + "' is already taken");
    }
}
