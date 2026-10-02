package com.elearny.payment;

import com.elearny.common.exception.BusinessRuleException;
import com.elearny.course.Course;
import com.elearny.course.CourseService;
import com.elearny.payment.dto.CouponCreateRequest;
import com.elearny.payment.dto.CouponResponse;
import com.elearny.user.Role;
import com.elearny.user.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CouponServiceTest {

    @Mock
    private CouponRepository couponRepository;

    @Mock
    private CourseService courseService;

    @InjectMocks
    private CouponService couponService;

    private User instructor;
    private Course course;
    private Coupon coupon;

    @BeforeEach
    void setUp() {
        instructor = User.builder()
                .email("instructor@example.com")
                .role(Role.INSTRUCTOR)
                .canCreatePlatformCoupons(true)
                .build();
        instructor.setId(2L);

        course = Course.builder()
                .title("Spring Boot Deep Dive")
                .instructor(instructor)
                .price(BigDecimal.valueOf(100.00))
                .build();
        course.setId(10L);

        coupon = Coupon.builder()
                .code("SAVE20")
                .discountType(DiscountType.PERCENTAGE)
                .discountValue(BigDecimal.valueOf(20.00))
                .expiryDate(LocalDate.now().plusDays(7))
                .build();
        coupon.setId(1L);
    }

    @Test
    void create_ShouldSaveCoupon_WhenRequestIsValid() {
        CouponCreateRequest req = new CouponCreateRequest(
                "SAVE20", DiscountType.PERCENTAGE, BigDecimal.valueOf(20.00),
                LocalDate.now().plusDays(7), 100, null
        );

        when(couponRepository.findByCodeIgnoreCase("SAVE20")).thenReturn(Optional.empty());
        when(couponRepository.save(any(Coupon.class))).thenReturn(coupon);

        CouponResponse result = couponService.create(instructor, req);

        assertNotNull(result);
        assertEquals("SAVE20", result.code());
        verify(couponRepository, times(1)).save(any(Coupon.class));
    }

    @Test
    void create_ShouldThrowException_WhenCodeAlreadyExists() {
        CouponCreateRequest req = new CouponCreateRequest(
                "SAVE20", DiscountType.PERCENTAGE, BigDecimal.valueOf(20.00),
                LocalDate.now().plusDays(7), 100, null
        );

        when(couponRepository.findByCodeIgnoreCase("SAVE20")).thenReturn(Optional.of(coupon));

        assertThrows(BusinessRuleException.class, () -> couponService.create(instructor, req));
        verify(couponRepository, never()).save(any());
    }
}
