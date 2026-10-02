package com.elearny.community.dto;

import java.util.List;

public record ForumThreadResponse(Long id, String studentName, String questionText, int upvotes, List<ForumReplyResponse> replies) {}
