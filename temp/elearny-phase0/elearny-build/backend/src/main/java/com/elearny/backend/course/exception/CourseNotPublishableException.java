package com.elearny.backend.course.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class CourseNotPublishableException extends ApiException {
    public CourseNotPublishableException(String reason) {
        super(HttpStatus.BAD_REQUEST, "Course can't be published yet: " + reason);
    }
}
