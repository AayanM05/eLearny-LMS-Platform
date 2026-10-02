package com.elearny.community.dto;

import jakarta.validation.constraints.NotBlank;

public record ForumReplyCreateRequest(@NotBlank String replyText) {}
