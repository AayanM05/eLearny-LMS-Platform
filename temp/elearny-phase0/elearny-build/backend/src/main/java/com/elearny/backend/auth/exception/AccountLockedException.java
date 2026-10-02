package com.elearny.backend.auth.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class AccountLockedException extends ApiException {
    public AccountLockedException() {
        super(HttpStatus.FORBIDDEN, "This account is locked due to too many failed login attempts. Contact support.");
    }
}
