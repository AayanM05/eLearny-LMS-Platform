package com.elearny.dto.response;

import com.elearny.entity.DiscountType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CouponResponse(Long id, String code, DiscountType discountType, BigDecimal discountValue,
                              LocalDate expiryDate, Integer usageLimit, Integer timesUsed, boolean validNow) {}
