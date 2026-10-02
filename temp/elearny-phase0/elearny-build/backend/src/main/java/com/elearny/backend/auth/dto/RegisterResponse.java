package com.elearny.backend.auth.dto;

import java.util.UUID;

public record RegisterResponse(UUID id, String firstName, String username, String email, String role) {
}
