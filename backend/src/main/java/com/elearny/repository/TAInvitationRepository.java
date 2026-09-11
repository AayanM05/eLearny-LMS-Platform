package com.elearny.repository;

import com.elearny.entity.TAInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TAInvitationRepository extends JpaRepository<TAInvitation, Long> {
    Optional<TAInvitation> findByToken(String token);
    List<TAInvitation> findByCourseId(Long courseId);
}
