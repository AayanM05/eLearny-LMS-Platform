package com.elearny.backend.common.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Wraps JavaMailSender so a missing/misconfigured SMTP setup degrades
 * gracefully (logged, not thrown) instead of taking down registration or
 * the whole app context. This matters for local dev before GMAIL_SMTP_*
 * env vars are set — the OTP row is still created in the database even if
 * the email itself fails to send, so development can continue by reading
 * the code from a debug log line (see the comment on that line — it is
 * DEBUG level ONLY and must never be bumped to a level visible in
 * production, since that would leak live OTP codes into logs).
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String fromName;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${elearny.mail.from-address:}") String fromAddress,
            @Value("${elearny.mail.from-name:eLearny}") String fromName
    ) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.fromName = fromName;
    }

    public void sendOtpEmail(String toEmail, String recipientFirstName, String otpCode, int expiryMinutes) {
        String subject = "Your eLearny verification code";
        String body = """
                Hi %s,

                Your eLearny verification code is: %s

                This code expires in %d minutes. If you didn't request this, you can ignore this email.

                — eLearny
                """.formatted(recipientFirstName, otpCode, expiryMinutes);

        send(toEmail, subject, body, otpCode);
    }

    /**
     * Per prd.md §3.26: the setup link alone is NOT sufficient to activate
     * an instructor account — the OTP is also required, so a forwarded or
     * leaked email can't single-handedly grant account access.
     */
    public void sendInstructorInviteEmail(String toEmail, String recipientFirstName, String setupLink, String otpCode, int expiryHours) {
        String subject = "You're approved as an eLearny instructor — set up your account";
        String body = """
                Hi %s,

                Your instructor application has been approved! Set up your account here:
                %s

                You'll need this verification code to complete setup: %s

                This link and code expire in %d hours. If you didn't apply to become an eLearny instructor, you can ignore this email.

                — eLearny
                """.formatted(recipientFirstName, setupLink, otpCode, expiryHours);

        send(toEmail, subject, body, otpCode);
    }

    private void send(String toEmail, String subject, String body, String devFallbackOtp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(String.format("%s <%s>", fromName, fromAddress));
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {}: {}", maskEmail(toEmail), subject);
        } catch (Exception e) {
            // Deliberately NOT rethrown — see class comment. The calling
            // flow still succeeds; the OTP/token still exist in the database.
            log.error("Failed to send email to {} — is GMAIL_SMTP_USERNAME/GMAIL_SMTP_APP_PASSWORD set? ({})",
                    maskEmail(toEmail), e.getMessage());
            log.debug("[DEV FALLBACK] OTP/code for {} is: {}", maskEmail(toEmail), devFallbackOtp);
        }
    }

    private String maskEmail(String email) {
        int at = email.indexOf('@');
        if (at <= 1) return "***" + email.substring(at);
        return email.charAt(0) + "***" + email.substring(at);
    }
}
