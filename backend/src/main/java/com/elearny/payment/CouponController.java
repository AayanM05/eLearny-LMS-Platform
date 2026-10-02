package com.elearny.payment;

import com.elearny.common.util.SecurityUtils;
import com.elearny.payment.dto.CouponCreateRequest;
import com.elearny.payment.dto.CouponResponse;








import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons", description = "FR44/FR45")
public class CouponController {

    private final CouponService couponService;

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<CouponResponse> create(@Valid @RequestBody CouponCreateRequest req) {
        return ResponseEntity.ok(couponService.create(SecurityUtils.currentUser(), req));
    }
}
