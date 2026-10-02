package com.elearny.backend.course.exception;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class CourseNotFoundException extends ApiException {
    public CourseNotFoundException() {
        super(HttpStatus.NOT_FOUND, "Course not found");
    }
}
