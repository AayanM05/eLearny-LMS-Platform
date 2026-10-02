package com.elearny.dto.response;

import com.elearny.entity.ContentType;

public record SubsectionResponse(Long id, String title, ContentType contentType, Integer order, boolean completed) {}
