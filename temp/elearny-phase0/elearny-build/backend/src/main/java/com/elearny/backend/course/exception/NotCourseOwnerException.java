package com.elearny.backend.course.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class NotCourseOwnerException extends ApiException {
    public NotCourseOwnerException() {
        // 404, not 403 — deliberately doesn't confirm the course exists at
        // all to an instructor who doesn't own it, same enumeration
        // reasoning used elsewhere in this codebase (e.g. InvalidCredentialsException).
        super(HttpStatus.NOT_FOUND, "Course not found");
    }
}
