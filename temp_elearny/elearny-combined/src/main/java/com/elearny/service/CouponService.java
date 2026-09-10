package com.elearny.service;

import com.elearny.dto.request.CouponCreateRequest;
import com.elearny.dto.response.CouponResponse;
import com.elearny.entity.*;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.BusinessRuleException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/** Section 7.15 (Coupons): FR44/FR45. Optimistic locking on Coupon.timesUsed prevents over-redemption races. */
@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final CourseService courseService;

    @Transactional
    public CouponResponse create(User requester, CouponCreateRequest req) {
        // FR34 / UI spec I5: platform-wide (courseId == null) coupons are Admin-only UNLESS the
        // requesting Instructor has been explicitly granted canCreatePlatformCoupons (see
        // AdminService.setCouponEligibility) — "eligible instructor" is a real, auditable Admin
        // decision, not an implicit status inferred from tenure/rating/anything else.
        if (req.courseId() == null) {
            boolean allowed = requester.getRole() == Role.ADMIN
                    || (requester.getRole() == Role.INSTRUCTOR && requester.isCanCreatePlatformCoupons());
            if (!allowed) {
                throw new AccessDeniedCustomException(
                        "Only Admins, or Instructors granted platform-coupon permission, can create platform-wide coupons.");
            }
        }
        Course course = null;
        if (req.courseId() != null) {
            course = courseService.findEntity(req.courseId());
            courseService.assertOwnerOrAdmin(requester, course);
        }
        if (couponRepository.findByCodeIgnoreCase(req.code()).isPresent()) {
            throw new BusinessRuleException("Coupon code already exists.");
        }
        Coupon coupon = Coupon.builder()
                .code(req.code().toUpperCase())
                .discountType(req.discountType())
                .discountValue(req.discountValue())
                .expiryDate(req.expiryDate())
                .usageLimit(req.usageLimit())
                .timesUsed(0)
                .course(course)
                .createdBy(requester)
                .build();
        coupon = couponRepository.save(coupon);
        return toResponse(coupon);
    }

    /** Validates a coupon for a given course and returns the discounted price. Does NOT increment usage
     *  (that happens only on payment capture — see PaymentService.applyCouponUsage). */
    public BigDecimal previewDiscount(String code, Course course) {
        Coupon coupon = getValidCouponOrThrow(code, course);
        return computeDiscountedPrice(course.getPrice(), coupon);
    }

    public Coupon getValidCouponOrThrow(String code, Course course) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid coupon code."));
        if (!coupon.isValidNow()) {
            throw new BusinessRuleException("This coupon has expired or reached its usage limit.");
        }
        if (coupon.getCourse() != null && !coupon.getCourse().getId().equals(course.getId())) {
            throw new BusinessRuleException("This coupon is not valid for this course.");
        }
        return coupon;
    }

    public BigDecimal computeDiscountedPrice(BigDecimal price, Coupon coupon) {
        BigDecimal discount = coupon.getDiscountType() == DiscountType.PERCENTAGE
                ? price.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100))
                : coupon.getDiscountValue();
        BigDecimal result = price.subtract(discount);
        return result.signum() < 0 ? BigDecimal.ZERO : result;
    }

    /** Optimistic-lock protected increment; retried by the caller on ObjectOptimisticLockingFailureException. */
    @Transactional
    public void incrementUsage(Coupon coupon) {
        coupon.setTimesUsed(coupon.getTimesUsed() + 1);
        couponRepository.save(coupon);
    }

    private CouponResponse toResponse(Coupon c) {
        return new CouponResponse(c.getId(), c.getCode(), c.getDiscountType(), c.getDiscountValue(),
                c.getExpiryDate(), c.getUsageLimit(), c.getTimesUsed(), c.isValidNow());
    }
}
