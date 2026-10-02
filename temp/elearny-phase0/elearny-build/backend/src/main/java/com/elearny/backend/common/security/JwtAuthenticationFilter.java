package com.elearny.backend.common.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Reads the Authorization: Bearer <token> header, validates it, and — only
 * for genuine access tokens — populates Spring Security's context so
 * @PreAuthorize / hasRole checks work in later phases. Any failure here
 * (missing header, expired token, refresh token used where an access token
 * is required) simply leaves the request unauthenticated rather than
 * throwing — SecurityConfig's `.anyRequest().authenticated()` is what
 * actually rejects it with a 401, keeping this filter's job narrow.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring("Bearer ".length());
            try {
                var claims = jwtService.parseAndValidate(token);

                if (jwtService.isAccessToken(claims)) {
                    var userId = jwtService.getUserId(claims);
                    var role = jwtService.getRole(claims);
                    var authorities = role != null
                            ? List.of(new SimpleGrantedAuthority("ROLE_" + role))
                            : List.<SimpleGrantedAuthority>of();

                    var authentication = new UsernamePasswordAuthenticationToken(userId, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
                // A valid-but-refresh token deliberately does NOT authenticate
                // the request -- refresh tokens are only ever accepted by the
                // dedicated /api/v1/auth/refresh endpoint, which reads and
                // validates the raw request body itself, not this filter.
            } catch (JwtException | IllegalArgumentException e) {
                // Malformed/expired/invalid signature -- leave unauthenticated,
                // let SecurityConfig's authorization rules produce the 401.
            }
        }

        filterChain.doFilter(request, response);
    }
}
