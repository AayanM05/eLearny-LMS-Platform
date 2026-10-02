package com.elearny.course.dto;

import com.elearny.course.ContentType;









public record SubsectionResponse(Long id, String title, ContentType contentType, Integer order, boolean completed) {}
