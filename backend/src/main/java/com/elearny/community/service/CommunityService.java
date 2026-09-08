package com.elearny.community.service;

import com.elearny.community.dto.*;
import com.elearny.community.entity.Discussion;
import com.elearny.community.entity.DiscussionReply;
import com.elearny.community.repository.DiscussionReplyRepository;
import com.elearny.community.repository.DiscussionRepository;
import com.elearny.course.entity.Course;
import com.elearny.course.repository.CourseRepository;
import com.elearny.user.entity.User;
import com.elearny.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final DiscussionRepository discussionRepository;
    private final DiscussionReplyRepository discussionReplyRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Transactional
    public DiscussionDto createDiscussion(UUID userId, CreateDiscussionRequest request) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + request.getCourseId()));

        Discussion discussion = Discussion.builder()
                .course(course)
                .author(author)
                .title(request.getTitle())
                .content(request.getContent())
                .pinned(false)
                .build();

        Discussion saved = discussionRepository.save(discussion);
        return mapToDto(saved, true);
    }

    @Transactional(readOnly = true)
    public List<DiscussionDto> getCourseDiscussions(UUID courseId) {
        return discussionRepository.findByCourseIdOrderByPinnedDescCreatedAtDesc(courseId)
                .stream()
                .map(d -> mapToDto(d, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DiscussionDto getDiscussionById(UUID discussionId) {
        Discussion discussion = discussionRepository.findById(discussionId)
                .orElseThrow(() -> new IllegalArgumentException("Discussion not found: " + discussionId));
        return mapToDto(discussion, true);
    }

    @Transactional
    public DiscussionReplyDto addReply(UUID userId, UUID discussionId, CreateReplyRequest request) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Discussion discussion = discussionRepository.findById(discussionId)
                .orElseThrow(() -> new IllegalArgumentException("Discussion not found: " + discussionId));

        DiscussionReply reply = DiscussionReply.builder()
                .discussion(discussion)
                .author(author)
                .content(request.getContent())
                .acceptedAnswer(false)
                .build();

        DiscussionReply saved = discussionReplyRepository.save(reply);
        return mapToReplyDto(saved);
    }

    private DiscussionDto mapToDto(Discussion d, boolean includeReplies) {
        List<DiscussionReplyDto> replyDtos = null;
        if (includeReplies && d.getReplies() != null) {
            replyDtos = d.getReplies().stream()
                    .map(this::mapToReplyDto)
                    .collect(Collectors.toList());
        }

        return DiscussionDto.builder()
                .id(d.getId())
                .courseId(d.getCourse().getId())
                .authorId(d.getAuthor().getId())
                .authorName(d.getAuthor().getFullName())
                .title(d.getTitle())
                .content(d.getContent())
                .pinned(d.isPinned())
                .createdAt(d.getCreatedAt())
                .replyCount(d.getReplies() != null ? d.getReplies().size() : 0)
                .replies(replyDtos)
                .build();
    }

    private DiscussionReplyDto mapToReplyDto(DiscussionReply r) {
        return DiscussionReplyDto.builder()
                .id(r.getId())
                .discussionId(r.getDiscussion().getId())
                .authorId(r.getAuthor().getId())
                .authorName(r.getAuthor().getFullName())
                .content(r.getContent())
                .acceptedAnswer(r.isAcceptedAnswer())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
