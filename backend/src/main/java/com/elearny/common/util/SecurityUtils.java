package com.elearny.common.util;

import com.elearny.auth.security.UserPrincipal;
import com.elearny.user.User;








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
