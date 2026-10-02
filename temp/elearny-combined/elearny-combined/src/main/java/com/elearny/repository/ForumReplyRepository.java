package com.elearny.repository;

import com.elearny.entity.ForumReply;
import com.elearny.entity.ForumThread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForumReplyRepository extends JpaRepository<ForumReply, Long> {
    List<ForumReply> findByThreadOrderByCreatedAtAsc(ForumThread thread);
}
