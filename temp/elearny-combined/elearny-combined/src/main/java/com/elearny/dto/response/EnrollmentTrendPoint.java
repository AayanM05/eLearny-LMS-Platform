package com.elearny.dto.response;

import java.time.LocalDate;

/** UI spec AD6: one point on the "enrollment trend" chart. */
public record EnrollmentTrendPoint(LocalDate date, long count) {}
