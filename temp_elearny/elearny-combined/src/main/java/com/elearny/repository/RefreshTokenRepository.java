package com.elearny.repository;

import com.elearny.entity.RefreshToken;
import com.elearny.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenHashAndRevokedFalse(String tokenHash);
    List<RefreshToken> findByUserAndRevokedFalse(User user);

    @Modifying
    @Query("update RefreshToken r set r.revoked = true where r.user = :user")
    void revokeAllForUser(@Param("user") User user);
}
