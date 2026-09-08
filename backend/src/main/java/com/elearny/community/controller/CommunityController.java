package com.elearny.community.controller;

import com.elearny.community.dto.*;
import com.elearny.community.service.CommunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @PostMapping("/discussions")
    public ResponseEntity<DiscussionDto> createDiscussion(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody CreateDiscussionRequest request) {
        DiscussionDto response = communityService.createDiscussion(UUID.fromString(userId), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/courses/{courseId}/discussions")
    public ResponseEntity<List<DiscussionDto>> getCourseDiscussions(@PathVariable UUID courseId) {
        List<DiscussionDto> discussions = communityService.getCourseDiscussions(courseId);
        return ResponseEntity.ok(discussions);
    }

    @GetMapping("/discussions/{id}")
    public ResponseEntity<DiscussionDto> getDiscussion(@PathVariable UUID id) {
        DiscussionDto discussion = communityService.getDiscussionById(id);
        return ResponseEntity.ok(discussion);
    }

    @PostMapping("/discussions/{id}/replies")
    public ResponseEntity<DiscussionReplyDto> addReply(
            @AuthenticationPrincipal String userId,
            @PathVariable UUID id,
            @Valid @RequestBody CreateReplyRequest request) {
        DiscussionReplyDto reply = communityService.addReply(UUID.fromString(userId), id, request);
        return ResponseEntity.ok(reply);
    }
}
