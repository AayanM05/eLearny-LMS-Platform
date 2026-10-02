package com.elearny.backend.auth.service;

import com.elearny.backend.auth.entity.User;
import com.elearny.backend.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Kept separate from AuthService because lockout is a distinct policy
 * concern (how many failed attempts before locking) that Phase 9's Admin
 * Governance work will eventually need its own unlock action against — a
 * dedicated service gives that future code one clear place to call into,
 * rather than reaching into AuthService's login-flow internals.
 *
 * No unlock mechanism exists yet (Phase 9 concern, not V1's Phase 1) — once
 * locked, an account stays locked. That's a deliberate, temporary
 * limitation, not an oversight; noted in memory.md.
 */
@Service
public class AccountLockoutService {

    private final UserRepository userRepository;
    private final int maxFailedAttempts;

    public AccountLockoutService(
            UserRepository userRepository,
            @Value("${elearny.account-lockout.max-failed-attempts:5}") int maxFailedAttempts
    ) {
        this.userRepository = userRepository;
        this.maxFailedAttempts = maxFailedAttempts;
    }

    @Transactional
    public void recordFailedAttempt(User user) {
        user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
        if (user.getFailedLoginAttempts() >= maxFailedAttempts) {
            user.setAccountLocked(true);
        }
        userRepository.save(user);
    }

    @Transactional
    public void recordSuccessfulLogin(User user) {
        if (user.getFailedLoginAttempts() > 0) {
            user.setFailedLoginAttempts(0);
            userRepository.save(user);
        }
    }
}
