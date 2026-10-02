package com.elearny.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * eLearny LMS Platform — Backend entry point.
 *
 * Phase 0 (Foundation): boots a bare Spring Boot application with a working
 * database connection (via Flyway migrations) and a health-check endpoint.
 * No business domains exist yet — those start in Phase 1 (Auth & Identity).
 */
@SpringBootApplication
public class ElearnyApplication {

    public static void main(String[] args) {
        SpringApplication.run(ElearnyApplication.class, args);
    }
}
