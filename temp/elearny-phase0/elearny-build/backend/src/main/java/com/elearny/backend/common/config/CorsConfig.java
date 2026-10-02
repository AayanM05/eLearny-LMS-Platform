package com.elearny.backend.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Without this, the browser blocks every request from the Next.js dev server
 * (localhost:3000) to this API (localhost:8080) as cross-origin — a browser
 * security rule, not something Postman/curl would ever hit.
 *
 * Exposed as a CorsConfigurationSource bean specifically (not just a
 * WebMvcConfigurer#addCorsMappings override) because Spring Security's own
 * filter chain runs BEFORE Spring MVC's dispatch and does NOT automatically
 * see MVC-level CORS config — it only picks up CORS if it finds a bean of
 * this exact type. SecurityConfig's `.cors(Customizer.withDefaults())` reads
 * this bean automatically. Missing this is a common gotcha that looks like
 * "CORS randomly still doesn't work even though I configured it."
 *
 * In production, Vercel's actual domain replaces localhost:3000 here (see
 * deployment.md) — this config is dev-only.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
