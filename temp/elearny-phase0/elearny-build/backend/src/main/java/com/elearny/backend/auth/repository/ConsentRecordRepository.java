package com.elearny.backend.auth.repository;

import com.elearny.backend.auth.entity.ConsentRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ConsentRecordRepository extends JpaRepository<ConsentRecord, UUID> {
}
