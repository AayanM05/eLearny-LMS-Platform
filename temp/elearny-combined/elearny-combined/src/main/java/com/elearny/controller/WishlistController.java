package com.elearny.controller;

import com.elearny.entity.Wishlist;
import com.elearny.service.WishlistService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist")
@PreAuthorize("hasRole('STUDENT')")
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/{courseId}")
    public ResponseEntity<Void> add(@PathVariable Long courseId) {
        wishlistService.add(SecurityUtils.currentUser(), courseId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> remove(@PathVariable Long courseId) {
        wishlistService.remove(SecurityUtils.currentUser(), courseId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Wishlist>> list() {
        return ResponseEntity.ok(wishlistService.list(SecurityUtils.currentUser()));
    }
}
