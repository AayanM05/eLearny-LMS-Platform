package com.elearny.service;

import com.elearny.entity.ConsentRecord;
import com.elearny.entity.User;
import com.elearny.repository.ConsentRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/** Section 7.25 (Consent & Terms): FR69/FR70 — versioned ToS acceptance, distinct parental-consent flag. */
@Service
@RequiredArgsConstructor
public class ConsentService {

    public static final String CURRENT_TOS_VERSION = "1.0";

    private final ConsentRecordRepository consentRecordRepository;

    public void recordConsent(User user, String tosVersion, String ipAddress, boolean isParental) {
        ConsentRecord record = ConsentRecord.builder()
                .user(user)
                .consentTextVersion(tosVersion)
                .ipAddress(ipAddress)
                .isParental(isParental)
                .signedAt(LocalDateTime.now())
                .build();
        consentRecordRepository.save(record);
    }
}
