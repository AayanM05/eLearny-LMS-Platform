package com.elearny.backend.instructor.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class ApplicationNotFoundException extends ApiException {
    public ApplicationNotFoundException() {
        super(HttpStatus.NOT_FOUND, "Application not found");
    }
}
