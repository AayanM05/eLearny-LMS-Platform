package com.elearny.revenue.service;

import com.elearny.course.repository.CourseRepository;
import com.elearny.enrollment.repository.EnrollmentRepository;
import com.elearny.payment.entity.Order;
import com.elearny.payment.entity.OrderStatus;
import com.elearny.payment.repository.OrderRepository;
import com.elearny.revenue.dto.InstructorEarningsDto;
import com.elearny.revenue.dto.RevenueAnalyticsDto;
import com.elearny.user.entity.Role;
import com.elearny.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RevenueService {

    private final OrderRepository orderRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public RevenueAnalyticsDto getPlatformRevenueAnalytics() {
        List<Order> completedOrders = orderRepository.findByStatus(OrderStatus.PAID);

        BigDecimal totalRevenue = completedOrders.stream()
                .map(Order::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 70% share to instructors, 30% platform margin
        BigDecimal totalInstructorPayouts = totalRevenue.multiply(new BigDecimal("0.70"))
                .setScale(2, RoundingMode.HALF_UP);

        long totalEnrollments = enrollmentRepository.count();
        long totalActiveCourses = courseRepository.count();
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalInstructors = userRepository.countByRole(Role.INSTRUCTOR);

        return RevenueAnalyticsDto.builder()
                .totalPlatformRevenue(totalRevenue)
                .totalInstructorPayouts(totalInstructorPayouts)
                .totalCompletedOrders(completedOrders.size())
                .totalEnrollments(totalEnrollments)
                .totalActiveCourses(totalActiveCourses)
                .totalStudents(totalStudents)
                .totalInstructors(totalInstructors)
                .build();
    }

    @Transactional(readOnly = true)
    public InstructorEarningsDto getInstructorEarnings(UUID instructorId) {
        List<Order> instructorOrders = orderRepository.findByCourseInstructorIdAndStatus(instructorId, OrderStatus.PAID);

        BigDecimal totalSales = instructorOrders.stream()
                .map(Order::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netEarnings = totalSales.multiply(new BigDecimal("0.70"))
                .setScale(2, RoundingMode.HALF_UP);

        long publishedCourses = courseRepository.findByInstructorIdOrderByCreatedAtDesc(instructorId).size();

        return InstructorEarningsDto.builder()
                .totalSales(totalSales)
                .netEarnings(netEarnings)
                .totalStudentsEnrolled((long) instructorOrders.size())
                .publishedCoursesCount(publishedCourses)
                .build();
    }
}
