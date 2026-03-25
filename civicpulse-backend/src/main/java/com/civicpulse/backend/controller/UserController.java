package com.civicpulse.backend.controller;

import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.repository.UserRepository;
import com.civicpulse.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(toUserMap(user));
    }

    @GetMapping("/workers")
    @PreAuthorize("hasRole('AUTHORITY') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getWorkers(
            @RequestParam(required = false) String department) {
        List<User> workers;
        if (department != null && !department.isEmpty()) {
            workers = authService.getWorkersByDepartment(department);
        } else {
            workers = authService.getWorkers();
        }
        return ResponseEntity.ok(workers.stream().map(this::toUserMap).collect(Collectors.toList()));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
        return ResponseEntity.ok(
            userRepository.findTopCitizens().stream()
                .limit(20)
                .map(this::toUserMap)
                .collect(Collectors.toList())
        );
    }

    private Map<String, Object> toUserMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("role", user.getRole().name());
        map.put("department", user.getDepartment());
        map.put("avatar", user.getAvatar());
        map.put("points", user.getPoints());
        map.put("badges", user.getBadges());
        map.put("activeTasksCount", user.getActiveTasksCount());
        map.put("completedTasksCount", user.getCompletedTasksCount());
        map.put("slaComplianceRate", user.getSlaComplianceRate());
        map.put("rating", user.getRating());
        return map;
    }
}
