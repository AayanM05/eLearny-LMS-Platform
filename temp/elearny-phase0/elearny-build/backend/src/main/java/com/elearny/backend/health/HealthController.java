package com.elearny.backend.health;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;

/**
 * Phase 0 deliverable: confirms the API is up AND that it can actually reach
 * the database — not just that the JVM booted. GET /api/v1/health is what
 * Render's health-check probe hits in production (see deployment.md).
 */
@RestController
@RequestMapping("/api/v1")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    public HealthResponse health() {
        boolean dbReachable;
        try (Connection connection = dataSource.getConnection()) {
            dbReachable = connection.isValid(2);
        } catch (Exception e) {
            dbReachable = false;
        }

        return new HealthResponse(
                dbReachable ? "UP" : "DEGRADED",
                dbReachable,
                Instant.now()
        );
    }

    public record HealthResponse(String status, boolean databaseReachable, Instant timestamp) {
    }
}
