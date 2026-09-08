package com.elearny.community.repository;

import com.elearny.community.entity.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, UUID> {
    List<Discussion> findByCourseIdOrderByPinnedDescCreatedAtDesc(UUID courseId);
}
