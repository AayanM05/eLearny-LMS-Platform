package com.elearny.community;

import com.elearny.course.Subsection;








import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForumThreadRepository extends JpaRepository<ForumThread, Long> {
    List<ForumThread> findBySubsectionOrderByUpvotesDescCreatedAtDesc(Subsection subsection);
}
