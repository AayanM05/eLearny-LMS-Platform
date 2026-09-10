package com.elearny.repository;

import com.elearny.entity.LoginHistory;
import com.elearny.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
    List<LoginHistory> findByUserOrderByLoggedInAtDesc(User user, Pageable pageable);
}
