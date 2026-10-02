package com.elearny.controller;

import com.elearny.service.DataPrivacyService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/privacy")
@RequiredArgsConstructor
@Tag(name = "Data Privacy", description = "FR64-FR66")
public class PrivacyController {

    private final DataPrivacyService dataPrivacyService;

    @GetMapping(value = "/export", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> export() {
        return ResponseEntity.ok(dataPrivacyService.exportUserData(SecurityUtils.currentUser()));
    }

    @PostMapping("/delete-account")
    public ResponseEntity<Void> deleteAccount() {
        dataPrivacyService.anonymizeAccount(SecurityUtils.currentUser());
        return ResponseEntity.ok().build();
    }
}
