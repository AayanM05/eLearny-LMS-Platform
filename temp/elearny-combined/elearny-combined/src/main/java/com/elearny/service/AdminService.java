package com.elearny.service;

import com.elearny.dto.response.DashboardStatsResponse;
import com.elearny.dto.response.UserSummary;
import com.elearny.entity.*;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.BusinessRuleException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/** Section 7.28: FR2 (instructor approval) + Admin dashboard stats. */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PaymentRepository paymentRepository;
    private final RefundRequestRepository refundRequestRepository;
    private final CommunicationLogRepository communicationLogRepository;
    private final AuditService auditService;
    private final com.elearny.service.notification.NotificationDispatcher notificationDispatcher;

    public List<User> pendingInstructorApprovals() {
        return userRepository.findByRoleAndApprovedFalse(Role.INSTRUCTOR);
    }

    @Transactional
    public void approveInstructor(User admin, Long instructorId, boolean approve) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));
        instructor.setApproved(approve);
        if (!approve) {
            instructor.setActive(false);
        }
        userRepository.save(instructor);
        auditService.log(admin, approve ? "APPROVE_INSTRUCTOR" : "REJECT_INSTRUCTOR", "User", instructor.getId(), null);
        notificationDispatcher.dispatch(instructor, NotificationType.GENERAL,
                approve ? "Your instructor account is approved!" : "Your instructor application was not approved",
                approve ? "You can now create and publish courses." : "Contact support for more information.",
                "instructor-approval:" + instructor.getId());
    }

    /** UI spec AD7: search/filter across every role (unlike pendingInstructorApprovals(), which
     *  is scoped to one specific workflow), for a general-purpose admin user directory. */
    public Page<UserSummary> listUsers(Role role, String q, Pageable pageable) {
        return userRepository.searchAll(role, q == null ? "" : q, pageable).map(UserSummary::from);
    }

    /** UI spec AD7: deactivate any user, any role — distinct from approveInstructor(..., false),
     *  which is specifically the instructor-application-rejection workflow (Section 5, A11 / AD2).
     *  Confirmation-gated on the frontend per the spec; this is the actual server-side action. */
    @Transactional
    public void deactivateUser(User admin, Long userId, String reason) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (target.getId().equals(admin.getId())) {
            throw new BusinessRuleException("You can't deactivate your own account.");
        }
        target.setActive(false);
        userRepository.save(target);
        auditService.log(admin, "DEACTIVATE_USER", "User", target.getId(), reason);
    }

    /** FR34 / UI spec I5: grants or revokes an Instructor's permission to create platform-wide
     *  (not just course-scoped) coupons — see CouponService.create(). */
    @Transactional
    public void setCouponEligibility(User admin, Long instructorId, boolean eligible) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));
        if (instructor.getRole() != Role.INSTRUCTOR) {
            throw new BusinessRuleException("Platform-coupon permission only applies to Instructor accounts.");
        }
        instructor.setCanCreatePlatformCoupons(eligible);
        userRepository.save(instructor);
        auditService.log(admin, eligible ? "GRANT_PLATFORM_COUPON_ELIGIBILITY" : "REVOKE_PLATFORM_COUPON_ELIGIBILITY",
                "User", instructor.getId(), null);
    }

    public DashboardStatsResponse dashboardStats() {
        long students = userRepository.findAll().stream().filter(u -> u.getRole() == Role.STUDENT).count();
        long instructors = userRepository.findAll().stream().filter(u -> u.getRole() == Role.INSTRUCTOR).count();
        long courses = courseRepository.count();
        BigDecimal revenue = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == PaymentStatus.CAPTURED)
                .map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        long pendingApprovals = pendingInstructorApprovals().size();
        long pendingRefunds = refundRequestRepository.findByStatus(RefundStatus.REQUESTED).size();
        long failedDeliveries = communicationLogRepository.countByStatus(CommunicationStatus.FAILED);
        return new DashboardStatsResponse(students, instructors, courses, revenue, pendingApprovals, pendingRefunds, failedDeliveries);
    }
}
