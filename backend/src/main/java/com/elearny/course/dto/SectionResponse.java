package com.elearny.course.dto;

import java.util.List;

public record SectionResponse(Long id, String title, Integer order, List<SubsectionResponse> subsections) {}
