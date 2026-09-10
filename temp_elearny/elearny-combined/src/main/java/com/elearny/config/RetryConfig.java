package com.elearny.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;

/** Enables @Retryable/@Recover for email/SMS delivery (Section 8.1). */
@Configuration
@EnableRetry
public class RetryConfig {
}
