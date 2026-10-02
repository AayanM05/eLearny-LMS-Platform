package com.elearny.backend.instructor.service;

import com.elearny.backend.auth.entity.OtpPurpose;
import com.elearny.backend.auth.entity.Role;
import com.elearny.backend.auth.entity.User;
import com.elearny.backend.auth.exception.UsernameAlreadyTakenException;
import com.elearny.backend.auth.repository.UserRepository;
import com.elearny.backend.auth.service.OtpService;
import com.elearny.backend.common.email.EmailService;
import com.elearny.backend.instructor.dto.ApplyInstructorRequest;
import com.elearny.backend.instructor.dto.InstructorApplicationResponse;
import com.elearny.backend.instructor.dto.RejectApplicationRequest;
import com.elearny.backend.instructor.dto.SetupAccountRequest;
import com.elearny.backend.instructor.entity.ApplicationStatus;
import com.elearny.backend.instructor.entity.InstructorApplication;
import com.elearny.backend.instructor.exception.ApplicationAlreadyPendingException;
import com.elearny.backend.instructor.exception.ApplicationNotFoundException;
import com.elearny.backend.instructor.exception.InvalidActivationTokenException;
import com.elearny.backend.instructor.repository.InstructorApplicationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class InstructorApplicationService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int ACTIVATION_TOKEN_EXPIRY_HOURS = 48;

    private final InstructorApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final EmailService emailService;
    private final String frontendBaseUrl;

    public InstructorApplicationService(
            InstructorApplicationRepository applicationRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            OtpService otpService,
            EmailService emailService,
            @Value("${elearny.frontend-base-url:http://localhost:3000}") String frontendBaseUrl
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.emailService = emailService;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @Transactional
    public InstructorApplicationResponse apply(UUID applicantUserId, ApplyInstructorRequest request) {
        applicationRepository.findFirstByApplicantIdAndStatus(applicantUserId, ApplicationStatus.PENDING)
                .ifPresent(existing -> {
                    throw new ApplicationAlreadyPendingException();
                });

        User applicant = userRepository.findById(applicantUserId)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found — should be impossible"));

        InstructorApplication application = new InstructorApplication();
        application.setApplicant(applicant);
        application.setBio(request.bio());
        application.setYearsExperience(request.yearsExperience());
        application.setExpertiseTags(request.expertiseTags());
        application.setPortfolioUrl(request.portfolioUrl());
        application.setResumeUrl(request.resumeUrl());
        application.setStatus(ApplicationStatus.PENDING);

        return toResponse(applicationRepository.save(application));
    }

    @Transactional(readOnly = true)
    public List<InstructorApplicationResponse> listPending() {
        return applicationRepository.findAllByStatusOrderByCreatedAtAsc(ApplicationStatus.PENDING)
                .stream().map(this::toResponse).toList();
    }

    /**
     * Approval does NOT elevate the applicant's existing Student account —
     * it deliberately creates the instructor identity as a fresh account
     * state (role flipped, but gated behind pendingActivation) rather than
     * silently granting Instructor access to whatever session the applicant
     * already has open. They must complete setup (token + OTP) before the
     * Instructor role is actually usable for login.
     */
    @Transactional
    public void approve(UUID applicationId, UUID reviewerAdminId) {
        InstructorApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(ApplicationNotFoundException::new);

        User admin = userRepository.findById(reviewerAdminId)
                .orElseThrow(() -> new IllegalStateException("Authenticated admin not found — should be impossible"));

        User applicant = application.getApplicant();
        applicant.setRole(Role.INSTRUCTOR);
        applicant.setPendingActivation(true);
        applicant.setEmailVerified(false); // re-verified at setup time, per prd.md §3.26

        String rawToken = generateRawToken();
        applicant.setActivationTokenHash(passwordEncoder.encode(rawToken));
        applicant.setActivationTokenExpiresAt(Instant.now().plus(Duration.ofHours(ACTIVATION_TOKEN_EXPIRY_HOURS)));
        userRepository.save(applicant);

        application.setStatus(ApplicationStatus.APPROVED);
        application.setReviewedBy(admin);
        application.setReviewedAt(Instant.now());
        applicationRepository.save(application);

        otpService.generateAndSend(applicant, OtpPurpose.INSTRUCTOR_SETUP);
        // otpService.generateAndSend already emails the OTP alone via
        // sendOtpEmail — but the instructor invite needs the SETUP LINK
        // too. Sending a second, combined invite email here, accepting one
        // redundant OTP email in the inbox for now rather than building a
        // second OtpService method just to suppress the first — simplicity
        // over an extra send, revisit if it's ever annoying in practice.
        String setupLink = frontendBaseUrl + "/instructor/setup-account?token=" + rawToken;
        emailService.sendInstructorInviteEmail(applicant.getEmail(), applicant.getFirstName(), setupLink, "(see the separate code email)", ACTIVATION_TOKEN_EXPIRY_HOURS);
    }

    @Transactional
    public void reject(UUID applicationId, UUID reviewerAdminId, RejectApplicationRequest request) {
        InstructorApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(ApplicationNotFoundException::new);

        User admin = userRepository.findById(reviewerAdminId)
                .orElseThrow(() -> new IllegalStateException("Authenticated admin not found — should be impossible"));

        application.setStatus(ApplicationStatus.REJECTED);
        application.setReviewedBy(admin);
        application.setReviewedAt(Instant.now());
        application.setRejectionReason(request.reason());
        applicationRepository.save(application);
    }

    /**
     * Token lookup is a linear scan over pending-activation users rather
     * than an indexed query, since there's no unique index on the hashed
     * token (hashes are salted per-value, so equality can't be indexed the
     * way a plain lookup could). Fine at V1's scale — pending-activation
     * instructor accounts are a small set at any given time — but would
     * need revisiting (e.g. a separate lookup-friendly token prefix) if
     * instructor invite volume ever got large.
     */
    @Transactional
    public void setupAccount(SetupAccountRequest request) {
        User user = userRepository.findAll().stream()
                .filter(u -> u.isPendingActivation()
                        && u.getActivationTokenHash() != null
                        && passwordEncoder.matches(request.token(), u.getActivationTokenHash()))
                .findFirst()
                .orElseThrow(InvalidActivationTokenException::new);

        if (user.getActivationTokenExpiresAt() == null || Instant.now().isAfter(user.getActivationTokenExpiresAt())) {
            throw new InvalidActivationTokenException();
        }

        if (userRepository.existsByUsernameIgnoreCase(request.username())
                && !user.getUsername().equalsIgnoreCase(request.username())) {
            throw new UsernameAlreadyTakenException(request.username());
        }

        otpService.verify(user, OtpPurpose.INSTRUCTOR_SETUP, request.otp());

        user.setUsername(request.username());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setEmailVerified(true);
        user.setPendingActivation(false);
        user.setActivationTokenHash(null);
        user.setActivationTokenExpiresAt(null);
        userRepository.save(user);
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private InstructorApplicationResponse toResponse(InstructorApplication app) {
        User applicant = app.getApplicant();
        return new InstructorApplicationResponse(
                app.getId(),
                applicant.getFirstName(),
                applicant.getLastName(),
                applicant.getEmail(),
                app.getBio(),
                app.getYearsExperience(),
                app.getExpertiseTags(),
                app.getPortfolioUrl(),
                app.getResumeUrl(),
                app.getStatus().name(),
                app.getCreatedAt()
        );
    }
}
