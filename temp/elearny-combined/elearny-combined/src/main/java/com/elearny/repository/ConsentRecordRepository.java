package com.elearny.repository;

import com.elearny.entity.ConsentRecord;
import com.elearny.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsentRecordRepository extends JpaRepository<ConsentRecord, Long> {
    List<ConsentRecord> findByUserOrderByCreatedAtDesc(User user);
}
