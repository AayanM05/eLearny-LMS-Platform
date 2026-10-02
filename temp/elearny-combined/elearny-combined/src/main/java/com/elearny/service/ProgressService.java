package com.elearny.service;

import com.elearny.dto.response.ProgressResponse;
import com.elearny.entity.*;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.EnrollmentRepository;
import com.elearny.repository.ProgressRepository;
import com.elearny.repository.SubsectionRepository;
import com.elearny.service.event.CourseCompletedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Section 7.6 (Progress): FR22-FR24. */
@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final SubsectionRepository subsectionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void markComplete(User student, Subsection subsection, Integer lastPositionSeconds) {
        assertEnrolled(student, subsection);
        Progress progress = progressRepository.findByUserAndSubsection(student, subsection)
                .orElseGet(() -> Progress.builder().user(student).subsection(subsection).completed(false).build());
        progress.setCompleted(true);
        if (lastPositionSeconds != null) {
            progress.setLastPositionSeconds(lastPositionSeconds);
        }
        progressRepository.save(progress);
        checkAndTriggerCompletion(student, subsection.getSection().getCourse());
    }

    /** Called by QuizService/AssignmentService when a quiz is passed or an assignment is graded. */
    @Transactional
    public void markCompleteSystem(User student, Subsection subsection) {
        Progress progress = progressRepository.findByUserAndSubsection(student, subsection)
                .orElseGet(() -> Progress.builder().user(student).subsection(subsection).completed(false).build());
        progress.setCompleted(true);
        progressRepository.save(progress);
        checkAndTriggerCompletion(student, subsection.getSection().getCourse());
    }

    private void assertEnrolled(User student, Subsection subsection) {
        Course course = subsection.getSection().getCourse();
        if (!enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)) {
            throw new AccessDeniedCustomException("You must be enrolled in this course to track progress.");
        }
    }

    public ProgressResponse getProgress(User student, Course course) {
        List<Subsection> all = course.getSections().stream()
                .flatMap(s -> s.getSubsections().stream()).toList();
        long total = all.size();
        long completed = progressRepository.countByUserAndSubsectionInAndCompletedTrue(student, all);
        double percent = total == 0 ? 0.0 : Math.round((completed * 10000.0 / total)) / 100.0;
        return new ProgressResponse(completed, total, percent);
    }

    private void checkAndTriggerCompletion(User student, Course course) {
        ProgressResponse progress = getProgress(student, course);
        if (progress.percent() >= 100.0) {
            Enrollment enrollment = enrollmentRepository.findByUserAndCourse(student, course)
                    .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
            eventPublisher.publishEvent(new CourseCompletedEvent(enrollment.getId())); // FR24
        }
    }
}
