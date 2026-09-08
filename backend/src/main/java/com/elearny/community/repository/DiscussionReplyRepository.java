package com.elearny.community.repository;

import com.elearny.community.entity.DiscussionReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DiscussionReplyRepository extends JpaRepository<DiscussionReply, UUID> {
    List<DiscussionReply> findByDiscussionIdOrderByCreatedAtAsc(UUID discussionId);
}
