package com.elearny.config;

import com.elearny.security.CustomUserDetailsService;
import com.elearny.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Section 16 (Security Design). Stateless JWT auth, BCrypt hashing, RBAC at the API level via
 * method security (@PreAuthorize) layered on top of these coarse-grained route rules.
 * Record-level ownership checks (e.g. "this certificate belongs to this student") are enforced
 * in the service layer per FR — not expressible as a route pattern.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * The frontend now runs as its own dev server (Vite, localhost:5173, see /frontend) rather
     * than being built and served by Spring Boot — so this backend needs to explicitly allow
     * that origin. "*" origin patterns + allowCredentials(true) already covers localhost:5173
     * (and any other origin) during development; tighten setAllowedOriginPatterns to the exact
     * production frontend URL(s) once this is actually deployed, rather than leaving it wide open.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    "/api/auth/**",
                    "/api/webhooks/**",
                    "/api/certificates/verify/**",
                    "/swagger-ui/**", "/v3/api-docs/**",
                    "/actuator/health", "/actuator/info"
                ).permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses", "/api/courses/{id:[0-9]+}").permitAll()
                // Admin-only
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                // Fine-grained role checks for the rest of the API live on @PreAuthorize; this is the floor
                .requestMatchers("/api/**").authenticated()
                // The frontend is no longer served by this backend (it runs separately via Vite —
                // see /frontend), so this backend has no static app-shell routes left to worry about.
                // Anything not matched above simply falls through to "authenticated" by default via
                // the rule below — nothing should realistically hit this path in normal operation.
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
