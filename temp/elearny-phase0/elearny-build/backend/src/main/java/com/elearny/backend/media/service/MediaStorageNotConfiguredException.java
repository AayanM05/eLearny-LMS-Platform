package com.elearny.backend.media.service;

import com.elearny.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class MediaStorageNotConfiguredException extends ApiException {
    public MediaStorageNotConfiguredException() {
        super(HttpStatus.SERVICE_UNAVAILABLE, "Media uploads aren't configured yet on this server (missing R2 credentials)");
    }
}
