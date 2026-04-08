package com.civicpulse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.Map;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalComplaints;
    private long resolved;
    private long inProgress;
    private long pending;
    private long critical;
    private long slaBreaches;
    private long resolvedToday;
    private double resolutionRate;
    private Map<String, Long> byCategory;
    private Map<String, Long> byStatus;
    private List<Map<String, Object>> weeklyTrend;
    private List<Map<String, Object>> topWorkers;
}
