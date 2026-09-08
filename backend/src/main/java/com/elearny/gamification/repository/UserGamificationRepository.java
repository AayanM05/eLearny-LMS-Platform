package com.elearny.gamification.repository;

import com.elearny.gamification.entity.UserGamification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserGamificationRepository extends JpaRepository<UserGamification, UUID> {
    List<UserGamification> findTop20ByOrderByXpDesc();
}
