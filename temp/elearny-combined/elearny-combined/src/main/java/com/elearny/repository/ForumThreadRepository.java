package com.elearny.repository;

import com.elearny.entity.ForumThread;
import com.elearny.entity.Subsection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForumThreadRepository extends JpaRepository<ForumThread, Long> {
    List<ForumThread> findBySubsectionOrderByUpvotesDescCreatedAtDesc(Subsection subsection);
}
