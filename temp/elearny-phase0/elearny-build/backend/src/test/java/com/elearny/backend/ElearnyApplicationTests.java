package com.elearny.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Phase 0's minimum bar: the Spring application context must load without
 * error. This will fail without a reachable Postgres instance (Flyway runs
 * on startup) — run `docker compose up -d` first, per the root README.
 */
@SpringBootTest
class ElearnyApplicationTests {

    @Test
    void contextLoads() {
        // Intentionally empty: a failing context load fails this test.
    }
}
