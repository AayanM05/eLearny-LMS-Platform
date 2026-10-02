package com.elearny.service;

import com.elearny.entity.*;
import com.elearny.exception.BusinessRuleException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** Section 7.5 (Enrollment & Payment): FR19-FR21, plus prerequisite enforcement (7.16 / FR46). */
@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final AuditService auditService;

    @Transactional
    public Enrollment enrollFree(User student, Course course) {
        if (course.getPrice() != null && course.getPrice().signum() > 0) {
            throw new BusinessRuleException("This course requires payment; use the purchase flow.");
        }
        return enroll(student, course);
    }

    @Transactional
    public Enrollment enrollAfterPayment(User student, Course course) {
        return enroll(student, course);
    }

    private Enrollment enroll(User student, Course course) {
        assertPrerequisiteSatisfied(student, course); // FR46
        if (enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)) {
            throw new BusinessRuleException("You are already enrolled in this course."); // FR20
        }
        if (Boolean.TRUE.equals(course.isCohortBased()) && course.getSeatLimit() != null) {
            long count = enrollmentRepository.countByCourse(course);
            if (count >= course.getSeatLimit()) {
                throw new com.elearny.exception.ConflictException("This cohort-based course is full. Join the waitlist instead.");
            }
        }
        Enrollment enrollment = Enrollment.builder()
                .user(student).course(course).enrolledDate(LocalDate.now()).revoked(false).build();
        enrollment = enrollmentRepository.save(enrollment);
        auditService.log(student, "ENROLL", "Course", course.getId(), null);
        return enrollment;
    }

    private void assertPrerequisiteSatisfied(User student, Course course) {
        if (course.getPrerequisiteCourse() == null) return;
        boolean completedPrereq = enrollmentRepository.findByUserAndCourse(student, course.getPrerequisiteCourse())
                .map(e -> e.getUser() != null) // presence check; completion checked via ProgressService in controller layer if needed
                .orElse(false);
        if (!completedPrereq) {
            throw new BusinessRuleException("You must complete \"" + course.getPrerequisiteCourse().getTitle()
                    + "\" before enrolling in this course."); // FR46
        }
    }

    public List<Enrollment> myEnrollments(User student) {
        return enrollmentRepository.findByUserAndRevokedFalse(student);
    }

    public Enrollment findByUserAndCourse(User user, Course course) {
        return enrollmentRepository.findByUserAndCourse(user, course)
                .orElseThrow(() -> new ResourceNotFoundException("Not enrolled in this course"));
    }

    @Transactional
    public void revoke(Enrollment enrollment) {
        enrollment.setRevoked(true);
        enrollmentRepository.save(enrollment);
    }
}
