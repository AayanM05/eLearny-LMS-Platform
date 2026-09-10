package com.elearny.dto.response;

import java.util.List;

public record ForumThreadResponse(Long id, String studentName, String questionText, int upvotes, List<ForumReplyResponse> replies) {}
