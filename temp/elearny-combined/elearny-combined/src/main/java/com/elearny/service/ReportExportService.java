package com.elearny.service;

import com.elearny.dto.response.CourseResponse;
import com.elearny.dto.response.EnrollmentTrendPoint;
import com.elearny.dto.response.InstructorPayoutSummary;
import com.elearny.entity.*;
import com.elearny.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Section 7.28 (Reporting & Export): FR68 (Admin/Instructor CSV/XLSX export of enrollments,
 * revenue, progress). UI spec AD6 additionally wants an "enrollment trend," "top-rated courses,"
 * and "instructor payout summary" report, each with an on-screen chart/table (the JSON methods
 * below) plus a CSV export button (the exportXCsv methods) — this class now covers all four
 * report types the spec's AD6 report picker describes, not just the original two.
 */
@Service
@RequiredArgsConstructor
public class ReportExportService {

    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;
    private final CourseService courseService;

    public byte[] exportEnrollmentsXlsx(Course course) {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Enrollments");
            Row header = sheet.createRow(0);
            String[] columns = {"Student Name", "Student Email", "Enrolled Date", "Revoked"};
            for (int i = 0; i < columns.length; i++) header.createCell(i).setCellValue(columns[i]);

            List<Enrollment> enrollments = enrollmentRepository.findAll().stream()
                    .filter(e -> e.getCourse().getId().equals(course.getId())).toList();
            int rowNum = 1;
            for (Enrollment e : enrollments) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(e.getUser().getName());
                row.createCell(1).setCellValue(e.getUser().getEmail());
                row.createCell(2).setCellValue(e.getEnrolledDate() != null ? e.getEnrolledDate().toString() : "");
                row.createCell(3).setCellValue(e.isRevoked());
            }
            for (int i = 0; i < columns.length; i++) sheet.autoSizeColumn(i);

            ByteArrayOutputStream os = new ByteArrayOutputStream();
            workbook.write(os);
            return os.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to export enrollments: " + e.getMessage(), e);
        }
    }

    public byte[] exportRevenueCsv() {
        StringBuilder sb = new StringBuilder("Course,Student,Amount,Status,Paid At\n");
        for (Payment p : paymentRepository.findAll()) {
            sb.append(csv(p.getCourse().getTitle())).append(',')
              .append(csv(p.getStudent().getName())).append(',')
              .append(p.getAmount()).append(',')
              .append(p.getStatus()).append(',')
              .append(p.getPaidAt() != null ? p.getPaidAt() : "").append('\n');
        }
        return sb.toString().getBytes();
    }

    public List<EnrollmentTrendPoint> enrollmentTrend(int days) {
        return enrollmentRepository.enrollmentTrend(LocalDate.now().minusDays(days)).stream()
                .map(row -> new EnrollmentTrendPoint(row.getDate(), row.getCount()))
                .toList();
    }

    public byte[] exportEnrollmentTrendCsv(int days) {
        StringBuilder sb = new StringBuilder("Date,Enrollments\n");
        for (EnrollmentTrendPoint point : enrollmentTrend(days)) {
            sb.append(point.date()).append(',').append(point.count()).append('\n');
        }
        return sb.toString().getBytes();
    }

    public List<CourseResponse> topRatedCourses(int limit) {
        return courseService.topRatedCourses(limit);
    }

    public byte[] exportTopRatedCoursesCsv(int limit) {
        StringBuilder sb = new StringBuilder("Course,Instructor,Average Rating,Review Count\n");
        for (CourseResponse c : topRatedCourses(limit)) {
            sb.append(csv(c.title())).append(',').append(csv(c.instructorName())).append(',')
              .append(c.averageRating()).append(',').append(c.reviewCount()).append('\n');
        }
        return sb.toString().getBytes();
    }

    public List<InstructorPayoutSummary> instructorPayoutSummary() {
        Map<String, BigDecimal> revenueByInstructor = new LinkedHashMap<>();
        Map<String, Long> countByInstructor = new LinkedHashMap<>();
        for (Payment p : paymentRepository.findAll()) {
            if (p.getStatus() != PaymentStatus.CAPTURED) continue;
            String name = p.getCourse().getInstructor().getName();
            revenueByInstructor.merge(name, p.getAmount(), BigDecimal::add);
            countByInstructor.merge(name, 1L, Long::sum);
        }
        return revenueByInstructor.entrySet().stream()
                .map(e -> new InstructorPayoutSummary(e.getKey(), e.getValue(), countByInstructor.get(e.getKey())))
                .sorted((a, b) -> b.totalRevenue().compareTo(a.totalRevenue()))
                .toList();
    }

    public byte[] exportInstructorPayoutsCsv() {
        StringBuilder sb = new StringBuilder("Instructor,Total Revenue,Payment Count\n");
        for (InstructorPayoutSummary row : instructorPayoutSummary()) {
            sb.append(csv(row.instructorName())).append(',').append(row.totalRevenue()).append(',')
              .append(row.paymentCount()).append('\n');
        }
        return sb.toString().getBytes();
    }

    private String csv(String value) {
        if (value == null) return "";
        return value.contains(",") ? "\"" + value.replace("\"", "\"\"") + "\"" : value;
    }
}
