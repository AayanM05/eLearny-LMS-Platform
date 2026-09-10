package com.elearny.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ForumReplyCreateRequest(@NotBlank String replyText) {}
