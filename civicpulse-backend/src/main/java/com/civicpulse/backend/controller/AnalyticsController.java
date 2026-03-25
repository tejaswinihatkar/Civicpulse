package com.civicpulse.backend.controller;

import com.civicpulse.backend.dto.DashboardStats;
import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    @GetMapping("/worker")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<Map<String, Object>> getWorkerStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(analyticsService.getWorkerStats(user.getId()));
    }
}
