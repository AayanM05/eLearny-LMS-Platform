package com.elearny.user.mapper;

import com.elearny.user.dto.UserDto;
import com.elearny.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .totpEnabled(user.isTotpEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
