package com.elearny.backend.auth.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class EmailAlreadyRegisteredException extends ApiException {
    public EmailAlreadyRegisteredException(String email) {
        // Deliberately vague message (doesn't confirm the email exists) to
        // avoid account enumeration via the registration endpoint.
        super(HttpStatus.CONFLICT, "An account with these details could not be created");
    }
}
