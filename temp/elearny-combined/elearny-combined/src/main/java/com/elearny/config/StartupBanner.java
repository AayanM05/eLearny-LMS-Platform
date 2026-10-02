package com.elearny.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * Prints a clear "the app is actually up, here's where" banner once Spring Boot has finished
 * starting AND every CommandLineRunner (including DataSeeder) has completed — ApplicationReadyEvent
 * fires after both, so this is never printed before seed data actually exists.
 */
@Component
@Slf4j
public class StartupBanner {

    private final Environment env;

    public StartupBanner(Environment env) {
        this.env = env;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        String port = env.getProperty("server.port", "8080");
        String contextPath = env.getProperty("server.servlet.context-path", "");
        String local = "http://localhost:" + port + contextPath;
        boolean isDev = java.util.Arrays.asList(env.getActiveProfiles()).contains("dev")
                || env.getActiveProfiles().length == 0; // dev is the default profile

        String dbHost = env.getProperty("DB_HOST", "localhost");
        String dbPort = env.getProperty("DB_PORT", "3306");
        String dbName = env.getProperty("DB_NAME", "elearny_dev");
        String dbUser = env.getProperty("DB_USERNAME", "root");

        StringBuilder sb = new StringBuilder();
        sb.append("\n");
        sb.append("========================================================================\n");
        sb.append("  eLearny started successfully!\n");
        sb.append("========================================================================\n");
        sb.append("  App:            ").append(local).append("\n");
        sb.append("  Swagger / API:  ").append(local).append("/swagger-ui.html\n");
        if (isDev) {
            sb.append("  Database:       MySQL at ").append(dbHost).append(":").append(dbPort)
              .append("/").append(dbName).append(" (user: ").append(dbUser).append(")\n");
            sb.append("                  Not connecting? Make sure a local MySQL server is running —\n");
            sb.append("                  see application-dev.yml or set DB_HOST/DB_PORT/DB_USERNAME/\n");
            sb.append("                  DB_PASSWORD env vars if your setup differs from the defaults.\n");
        }
        sb.append("------------------------------------------------------------------------\n");
        if (isDev) {
            sb.append("  Test accounts (see TESTING_GUIDE.md for full scenarios):\n");
            sb.append("    Admin       admin@elearny.com          / Admin@123\n");
            sb.append("    Instructor  instructor@elearny.com     / Instructor@123\n");
            sb.append("    Student     student@elearny.com        / Student@123\n");
            sb.append("    Student 2   student2@elearny.com       / Student@123\n");
            sb.append("    TA          ta@elearny.com             / Ta@12345\n");
            sb.append("    (Admin/Instructor logins will prompt for 2FA setup on first login —\n");
            sb.append("     that's expected, scan the QR code with any authenticator app.)\n");
            sb.append("    (These are only re-created if the database was empty at startup —\n");
            sb.append("     MySQL persists between runs, unlike the old H2 in-memory setup.)\n");
        }
        sb.append("========================================================================\n");

        // Print directly (not just via the logger) so it's unmistakable in the console regardless
        // of log-level configuration.
        System.out.println(sb);
        log.info("eLearny is running at {}", local);
    }
}
