package com.elearny.privacy;

import com.elearny.user.User;








import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsentRecordRepository extends JpaRepository<ConsentRecord, Long> {
    List<ConsentRecord> findByUserOrderByCreatedAtDesc(User user);
}
