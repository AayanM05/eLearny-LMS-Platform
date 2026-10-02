package com.elearny.controller;

import com.elearny.dto.response.CourseResponse;
import com.elearny.dto.response.EnrollmentTrendPoint;
import com.elearny.dto.response.InstructorPayoutSummary;
import com.elearny.entity.Course;
import com.elearny.service.CourseService;
import com.elearny.service.ReportExportService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** UI spec AD6 (Reports & Analytics): four report types, each with an on-screen JSON endpoint
 *  for charting and a CSV/XLSX export endpoint for download. */
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "FR68 - export + AD6 analytics")
public class ReportController {

    private final ReportExportService reportExportService;
    private final CourseService courseService;

    @GetMapping("/courses/{courseId}/enrollments.xlsx")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<byte[]> enrollmentsXlsx(@PathVariable Long courseId) {
        Course course = courseService.findEntity(courseId);
        courseService.assertOwnerOrAdmin(SecurityUtils.currentUser(), course);
        byte[] file = reportExportService.exportEnrollmentsXlsx(course);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=enrollments.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }

    @GetMapping("/revenue.csv")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> revenueCsv() {
        byte[] file = reportExportService.exportRevenueCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=revenue.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(file);
    }

    @GetMapping("/enrollment-trend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EnrollmentTrendPoint>> enrollmentTrend(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(reportExportService.enrollmentTrend(days));
    }

    @GetMapping("/enrollment-trend.csv")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> enrollmentTrendCsv(@RequestParam(defaultValue = "30") int days) {
        byte[] file = reportExportService.exportEnrollmentTrendCsv(days);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=enrollment-trend.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(file);
    }

    @GetMapping("/top-rated-courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CourseResponse>> topRatedCourses(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(reportExportService.topRatedCourses(limit));
    }

    @GetMapping("/top-rated-courses.csv")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> topRatedCoursesCsv(@RequestParam(defaultValue = "10") int limit) {
        byte[] file = reportExportService.exportTopRatedCoursesCsv(limit);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=top-rated-courses.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(file);
    }

    @GetMapping("/instructor-payouts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InstructorPayoutSummary>> instructorPayouts() {
        return ResponseEntity.ok(reportExportService.instructorPayoutSummary());
    }

    @GetMapping("/instructor-payouts.csv")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> instructorPayoutsCsv() {
        byte[] file = reportExportService.exportInstructorPayoutsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=instructor-payouts.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(file);
    }
}
