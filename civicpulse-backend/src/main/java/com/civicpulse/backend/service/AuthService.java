package com.civicpulse.backend.service;

import com.civicpulse.backend.dto.*;
import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.repository.UserRepository;
import com.civicpulse.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User.UserRole role;
        try {
            role = User.UserRole.valueOf(request.getRole().toUpperCase());
        } catch (Exception e) {
            role = User.UserRole.CITIZEN;
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .department(request.getDepartment())
                .ward(request.getWard())
                .build();

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .department(user.getDepartment())
                .points(user.getPoints())
                .badges(user.getBadges())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .department(user.getDepartment())
                .points(user.getPoints())
                .badges(user.getBadges())
                .build();
    }

    public List<User> getWorkers() {
        return userRepository.findByRole(User.UserRole.WORKER);
    }

    public List<User> getWorkersByDepartment(String department) {
        return userRepository.findByRoleAndDepartment(User.UserRole.WORKER, department);
    }
}
