package com.elearny.ta.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record TaInviteRequest(@NotBlank @Email String email) {}
