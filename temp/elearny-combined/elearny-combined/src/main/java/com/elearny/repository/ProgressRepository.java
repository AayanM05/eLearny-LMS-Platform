package com.elearny.repository;

import com.elearny.entity.Progress;
import com.elearny.entity.Subsection;
import com.elearny.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    Optional<Progress> findByUserAndSubsection(User user, Subsection subsection);
    List<Progress> findByUserAndSubsectionIn(User user, List<Subsection> subsections);
    long countByUserAndSubsectionInAndCompletedTrue(User user, List<Subsection> subsections);
}
