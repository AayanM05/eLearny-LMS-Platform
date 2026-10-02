package com.elearny.backend.auth.repository;

import com.elearny.backend.auth.entity.Role;
import com.elearny.backend.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);

    Optional<User> findByUsernameIgnoreCase(String username);

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByUsernameIgnoreCaseOrEmailIgnoreCase(String username, String email);

    boolean existsByRole(Role role);
}
