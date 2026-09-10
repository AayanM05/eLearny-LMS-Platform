package com.elearny.util;

import java.security.SecureRandom;
import java.util.UUID;

public final class CodeGenerator {

    private static final SecureRandom RANDOM = new SecureRandom();

    private CodeGenerator() {}

    public static String certificateCode() {
        return "ELN-CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public static String couponUsageSuffix() {
        return String.valueOf(100000 + RANDOM.nextInt(900000));
    }

    public static String randomToken() {
        return UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
    }
}
