package com.elearny.controller;

import com.elearny.dto.request.ForumReplyCreateRequest;
import com.elearny.dto.request.ForumThreadCreateRequest;
import com.elearny.dto.response.ForumReplyResponse;
import com.elearny.dto.response.ForumThreadResponse;
import com.elearny.service.ForumService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Discussion Forum", description = "FR36-FR38")
public class ForumController {

    private final ForumService forumService;

    @PostMapping("/api/subsections/{subsectionId}/threads")
    public ResponseEntity<ForumThreadResponse> createThread(@PathVariable Long subsectionId, @Valid @RequestBody ForumThreadCreateRequest req) {
        return ResponseEntity.ok(forumService.createThread(SecurityUtils.currentUser(), subsectionId, req));
    }

    @GetMapping("/api/subsections/{subsectionId}/threads")
    public ResponseEntity<List<ForumThreadResponse>> list(@PathVariable Long subsectionId) {
        return ResponseEntity.ok(forumService.forSubsection(subsectionId));
    }

    @PostMapping("/api/threads/{threadId}/replies")
    public ResponseEntity<ForumReplyResponse> reply(@PathVariable Long threadId, @Valid @RequestBody ForumReplyCreateRequest req) {
        return ResponseEntity.ok(forumService.reply(SecurityUtils.currentUser(), threadId, req));
    }

    @PostMapping("/api/threads/{threadId}/upvote")
    public ResponseEntity<Void> upvote(@PathVariable Long threadId) {
        forumService.upvote(threadId);
        return ResponseEntity.ok().build();
    }
}
