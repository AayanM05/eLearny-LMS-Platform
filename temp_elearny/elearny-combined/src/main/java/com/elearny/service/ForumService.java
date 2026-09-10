package com.elearny.service;

import com.elearny.dto.request.ForumReplyCreateRequest;
import com.elearny.dto.request.ForumThreadCreateRequest;
import com.elearny.dto.response.ForumReplyResponse;
import com.elearny.dto.response.ForumThreadResponse;
import com.elearny.entity.*;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.EnrollmentRepository;
import com.elearny.repository.ForumReplyRepository;
import com.elearny.repository.ForumThreadRepository;
import com.elearny.repository.TaAssignmentRepository;
import com.elearny.service.event.ForumReplyEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Section 7.11 (Discussion Forum): FR36-FR38 — scoped to a sub-section, instructor/TA can reply. */
@Service
@RequiredArgsConstructor
public class ForumService {

    private final ForumThreadRepository forumThreadRepository;
    private final ForumReplyRepository forumReplyRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final TaAssignmentRepository taAssignmentRepository;
    private final CourseContentService courseContentService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public ForumThreadResponse createThread(User student, Long subsectionId, ForumThreadCreateRequest req) {
        Subsection subsection = courseContentService.findSubsection(subsectionId);
        Course course = subsection.getSection().getCourse();
        if (!enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)) {
            throw new AccessDeniedCustomException("You must be enrolled to post in this forum.");
        }
        ForumThread thread = ForumThread.builder().subsection(subsection).student(student)
                .questionText(req.questionText()).upvotes(0).build();
        thread = forumThreadRepository.save(thread);
        return toResponse(thread);
    }

    @Transactional
    public ForumReplyResponse reply(User user, Long threadId, ForumReplyCreateRequest req) {
        ForumThread thread = forumThreadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found"));
        Course course = thread.getSubsection().getSection().getCourse();
        assertCanReply(user, course);
        ForumReply reply = ForumReply.builder().thread(thread).user(user).replyText(req.replyText()).build();
        reply = forumReplyRepository.save(reply);
        eventPublisher.publishEvent(new ForumReplyEvent(reply.getId())); // FR38 notify original poster
        return new ForumReplyResponse(reply.getId(), user.getName(), reply.getReplyText());
    }

    private void assertCanReply(User user, Course course) {
        boolean enrolled = enrollmentRepository.existsByUserAndCourseAndRevokedFalse(user, course);
        boolean owningInstructor = user.getRole() == Role.INSTRUCTOR && course.getInstructor().getId().equals(user.getId());
        boolean scopedTa = user.getRole() == Role.TEACHING_ASSISTANT
                && taAssignmentRepository.existsByCourseAndTaUserAndStatus(course, user, TaStatus.ACTIVE);
        boolean admin = user.getRole() == Role.ADMIN;
        if (!enrolled && !owningInstructor && !scopedTa && !admin) {
            throw new AccessDeniedCustomException("You are not authorized to reply in this forum.");
        }
    }

    @Transactional
    public void upvote(Long threadId) {
        ForumThread thread = forumThreadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found"));
        thread.setUpvotes(thread.getUpvotes() + 1);
        forumThreadRepository.save(thread);
    }

    public List<ForumThreadResponse> forSubsection(Long subsectionId) {
        Subsection subsection = courseContentService.findSubsection(subsectionId);
        return forumThreadRepository.findBySubsectionOrderByUpvotesDescCreatedAtDesc(subsection).stream()
                .map(this::toResponse).toList();
    }

    private ForumThreadResponse toResponse(ForumThread t) {
        List<ForumReplyResponse> replies = forumReplyRepository.findByThreadOrderByCreatedAtAsc(t).stream()
                .map(r -> new ForumReplyResponse(r.getId(), r.getUser().getName(), r.getReplyText())).toList();
        return new ForumThreadResponse(t.getId(), t.getStudent().getName(), t.getQuestionText(), t.getUpvotes(), replies);
    }
}
