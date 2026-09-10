package com.elearny.dto.request;

import com.elearny.entity.DiscountType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CouponCreateRequest(
        @NotBlank String code,
        @NotNull DiscountType discountType,
        @NotNull @DecimalMin("0.0") BigDecimal discountValue,
        LocalDate expiryDate,
        Integer usageLimit,
        Long courseId // null => platform-wide, Admin only
) {}
