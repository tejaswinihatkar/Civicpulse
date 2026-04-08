package com.civicpulse.backend.service;

import com.civicpulse.backend.dto.DashboardStats;
import com.civicpulse.backend.entity.Complaint;
import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.repository.ComplaintRepository;
import com.civicpulse.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public DashboardStats getDashboardStats() {
        long total = complaintRepository.count();
        long resolved = complaintRepository.countByStatus(Complaint.IssueStatus.RESOLVED);
        long inProgress = complaintRepository.countByStatus(Complaint.IssueStatus.IN_PROGRESS);
        long submitted = complaintRepository.countByStatus(Complaint.IssueStatus.SUBMITTED);
        long acknowledged = complaintRepository.countByStatus(Complaint.IssueStatus.ACKNOWLEDGED);
        long critical = complaintRepository.countByPriority(Complaint.IssuePriority.CRITICAL);
        long slaBreaches = complaintRepository.findSlaBreached(LocalDateTime.now()).size();
        long resolvedToday = complaintRepository.countByStatusAndResolvedAtAfter(
                Complaint.IssueStatus.RESOLVED, LocalDateTime.now().withHour(0).withMinute(0));
        double resolutionRate = total > 0 ? (resolved * 100.0 / total) : 0;

        // By category
        Map<String, Long> byCategory = new LinkedHashMap<>();
        complaintRepository.countByCategory().forEach(row -> {
            byCategory.put(row[0].toString(), (Long) row[1]);
        });

        // By status
        Map<String, Long> byStatus = new LinkedHashMap<>();
        complaintRepository.countByStatus().forEach(row -> {
            byStatus.put(row[0].toString(), (Long) row[1]);
        });

        // Weekly trend (last 7 days)
        List<Map<String, Object>> weeklyTrend = new ArrayList<>();
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Object[]> dailyCounts = complaintRepository.countPerDay(sevenDaysAgo);
        for (Object[] row : dailyCounts) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", row[0].toString());
            entry.put("count", row[1]);
            weeklyTrend.add(entry);
        }

        // Top workers
        List<Map<String, Object>> topWorkers = userRepository.findTopWorkers().stream()
                .limit(5)
                .map(w -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", w.getId());
                    map.put("name", w.getName());
                    map.put("department", w.getDepartment());
                    map.put("completedTasks", w.getCompletedTasksCount());
                    map.put("slaCompliance", w.getSlaComplianceRate());
                    map.put("rating", w.getRating());
                    map.put("avatar", w.getAvatar());
                    return map;
                })
                .collect(Collectors.toList());

        return DashboardStats.builder()
                .totalComplaints(total)
                .resolved(resolved)
                .inProgress(inProgress)
                .pending(submitted + acknowledged)
                .critical(critical)
                .slaBreaches(slaBreaches)
                .resolvedToday(resolvedToday)
                .resolutionRate(Math.round(resolutionRate * 10.0) / 10.0)
                .byCategory(byCategory)
                .byStatus(byStatus)
                .weeklyTrend(weeklyTrend)
                .topWorkers(topWorkers)
                .build();
    }

    public Map<String, Object> getWorkerStats(String workerId) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        long activeTasks = complaintRepository.countByStatusAndAssignedToId(Complaint.IssueStatus.IN_PROGRESS, workerId)
                + complaintRepository.countByStatusAndAssignedToId(Complaint.IssueStatus.ACKNOWLEDGED, workerId);

        List<Complaint> resolvedToday = complaintRepository.findResolvedByWorkerSince(
                workerId, LocalDateTime.now().withHour(0).withMinute(0));

        Map<String, Object> stats = new HashMap<>();
        stats.put("activeTasks", activeTasks);
        stats.put("completedToday", resolvedToday.size());
        stats.put("totalCompleted", worker.getCompletedTasksCount());
        stats.put("slaCompliance", worker.getSlaComplianceRate());
        stats.put("rating", worker.getRating());
        return stats;
    }
}
