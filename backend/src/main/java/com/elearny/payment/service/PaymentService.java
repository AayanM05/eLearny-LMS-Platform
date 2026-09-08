package com.elearny.payment.service;

import com.elearny.common.exception.ResourceNotFoundException;
import com.elearny.course.entity.Course;
import com.elearny.course.repository.CourseRepository;
import com.elearny.enrollment.service.EnrollmentService;
import com.elearny.payment.dto.CreateOrderRequest;
import com.elearny.payment.dto.OrderResponse;
import com.elearny.payment.entity.Order;
import com.elearny.payment.entity.OrderStatus;
import com.elearny.payment.repository.OrderRepository;
import com.elearny.user.entity.User;
import com.elearny.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentService enrollmentService;

    @Transactional
    public OrderResponse createOrder(UUID userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + request.getCourseId()));

        String mockRazorpayOrderId = "order_rzp_" + UUID.randomUUID().toString().substring(0, 8);

        Order order = Order.builder()
                .user(user)
                .course(course)
                .razorpayOrderId(mockRazorpayOrderId)
                .amount(course.getPrice())
                .currency("INR")
                .status(OrderStatus.CREATED)
                .build();

        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }

    @Transactional
    public OrderResponse verifyPayment(String razorpayOrderId, String razorpayPaymentId) {
        Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with razorpay id: " + razorpayOrderId));

        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setStatus(OrderStatus.PAID);
        Order saved = orderRepository.save(order);

        // Auto enroll user upon successful payment
        enrollmentService.enrollUserInCourse(order.getUser().getId(), order.getCourse().getId());

        return mapToResponse(saved);
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .courseId(order.getCourse().getId())
                .courseTitle(order.getCourse().getTitle())
                .razorpayOrderId(order.getRazorpayOrderId())
                .razorpayPaymentId(order.getRazorpayPaymentId())
                .amount(order.getAmount())
                .currency(order.getCurrency())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
