package com.elearny.repository;

import com.elearny.entity.Course;
import com.elearny.entity.Enrollment;
import com.elearny.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByUserAndCourse(User user, Course course);
    boolean existsByUserAndCourseAndRevokedFalse(User user, Course course);
    List<Enrollment> findByUserAndRevokedFalse(User user);
    long countByCourse(Course course);

    /** UI spec AD6: interface projection backing the "enrollment trend" chart/export. Named
     *  EnrollmentTrendRow (not *Point) to keep this repository-layer projection distinct from
     *  the dto/response/EnrollmentTrendPoint record the controller actually returns. */
    interface EnrollmentTrendRow {
        LocalDate getDate();
        Long getCount();
    }

    @Query("select e.enrolledDate as date, count(e) as count from Enrollment e " +
           "where e.enrolledDate >= :since group by e.enrolledDate order by e.enrolledDate")
    List<EnrollmentTrendRow> enrollmentTrend(@Param("since") LocalDate since);
}
