package com.elearny.backend.common.security;

import com.elearny.backend.auth.entity.Role;
import com.elearny.backend.auth.entity.User;
import com.elearny.backend.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Without this, there is no way to reach any ADMIN-only endpoint (approving
 * instructor applications, etc.) — registration only ever creates STUDENT
 * accounts, and there's no other bootstrap path. Runs once on every boot,
 * checks if ANY admin exists, and only creates one if none do — safe to
 * leave in permanently, not a one-time dev script to remember to remove.
 *
 * DEV-ONLY DEFAULT CREDENTIALS: override ADMIN_BOOTSTRAP_EMAIL and
 * ADMIN_BOOTSTRAP_PASSWORD before deploying anywhere real — same pattern as
 * JWT_SECRET and the Gmail SMTP credentials.
 */
@Component
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String bootstrapEmail;
    private final String bootstrapPassword;

    public AdminBootstrapRunner(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${elearny.admin-bootstrap.email:admin@elearny.local}") String bootstrapEmail,
            @Value("${elearny.admin-bootstrap.password:ChangeMe123!}") String bootstrapPassword
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.bootstrapEmail = bootstrapEmail;
        this.bootstrapPassword = bootstrapPassword;
    }

    @Override
    public void run(String... args) {
        boolean anyAdminExists = userRepository.findByEmailIgnoreCase(bootstrapEmail).isPresent()
                || userRepository.existsByUsernameIgnoreCase("admin");

        if (anyAdminExists) {
            return;
        }

        // A real "does any ADMIN-role user exist at all" check needs a
        // repository method — existsByRole — added alongside this runner.
        if (userRepository.existsByRole(Role.ADMIN)) {
            return;
        }

        User admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setUsername("admin");
        admin.setEmail(bootstrapEmail);
        admin.setPasswordHash(passwordEncoder.encode(bootstrapPassword));
        admin.setRole(Role.ADMIN);
        admin.setEmailVerified(true); // bootstrap account, no email loop needed
        userRepository.save(admin);

        log.warn("Bootstrapped a default ADMIN account (username: admin, email: {}). " +
                "CHANGE THIS PASSWORD before deploying anywhere real — set ADMIN_BOOTSTRAP_EMAIL " +
                "and ADMIN_BOOTSTRAP_PASSWORD env vars instead of relying on the default.", bootstrapEmail);
    }
}
