package com.elearny.payment.dto;

import com.elearny.payment.DiscountType;









import java.math.BigDecimal;
import java.time.LocalDate;

public record CouponResponse(Long id, String code, DiscountType discountType, BigDecimal discountValue,
                              LocalDate expiryDate, Integer usageLimit, Integer timesUsed, boolean validNow) {}
