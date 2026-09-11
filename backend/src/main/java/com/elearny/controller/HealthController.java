package com.elearny.controller;

import com.elearny.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> checkHealth() {
        Map<String, String> status = Map.of(
            "status", "UP",
            "version", "2.0.0",
            "platform", "eLearny LMS All-in-One Platform"
        );
        return ResponseEntity.ok(ApiResponse.success(status, "System health check operational"));
    }
}
