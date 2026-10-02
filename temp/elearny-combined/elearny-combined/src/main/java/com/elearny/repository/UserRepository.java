package com.elearny.repository;

import com.elearny.entity.Role;
import com.elearny.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    List<User> findByRoleAndApprovedFalse(Role role);

    @Query("select u from User u where u.role = :role and (lower(u.name) like lower(concat('%', :q, '%')) or lower(u.email) like lower(concat('%', :q, '%')))")
    Page<User> searchByRole(@Param("role") Role role, @Param("q") String q, Pageable pageable);

    @Query(value = "select * from users u where lower(u.name) like lower(concat('%', :q, '%')) or lower(u.email) like lower(concat('%', :q, '%'))", nativeQuery = true)
    List<User> fuzzySearch(@Param("q") String q);

    /** AD7 (Admin User Management): every role, optional role filter, optional name/email search. */
    @Query("select u from User u where (:role is null or u.role = :role) " +
           "and (lower(u.name) like lower(concat('%', :q, '%')) or lower(u.email) like lower(concat('%', :q, '%')))")
    Page<User> searchAll(@Param("role") Role role, @Param("q") String q, Pageable pageable);
}
