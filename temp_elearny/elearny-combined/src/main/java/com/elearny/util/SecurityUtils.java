package com.elearny.util;

import com.elearny.entity.User;
import com.elearny.security.UserPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static User currentUser() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return principal.getUser();
    }

    public static Long currentUserId() {
        return currentUser().getId();
    }
}
