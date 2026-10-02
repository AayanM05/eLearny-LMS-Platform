package com.elearny.user;


public record UserSummary(Long id, String name, String email, Role role, boolean approved, boolean totpEnabled) {
    public static UserSummary from(User u) {
        return new UserSummary(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.isApproved(), u.isTotpEnabled());
    }
}
