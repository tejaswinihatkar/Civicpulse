package com.civicpulse.backend.service;

import com.civicpulse.backend.entity.Complaint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class SlaService {

    @Value("${app.sla.critical:4}")
    private int slaCriticalHours;

    @Value("${app.sla.high:12}")
    private int slaHighHours;

    @Value("${app.sla.medium:48}")
    private int slaMediumHours;

    @Value("${app.sla.low:120}")
    private int slaLowHours;

    public LocalDateTime calculateDeadline(Complaint.IssuePriority priority) {
        int hours = switch (priority) {
            case CRITICAL -> slaCriticalHours;
            case HIGH -> slaHighHours;
            case MEDIUM -> slaMediumHours;
            case LOW -> slaLowHours;
        };
        return LocalDateTime.now().plusHours(hours);
    }

    public boolean isBreached(Complaint complaint) {
        if (complaint.getSlaDeadline() == null) return false;
        if (complaint.getStatus() == Complaint.IssueStatus.RESOLVED ||
            complaint.getStatus() == Complaint.IssueStatus.REJECTED) return false;
        return LocalDateTime.now().isAfter(complaint.getSlaDeadline());
    }

    public boolean isWarning(Complaint complaint) {
        if (complaint.getSlaDeadline() == null) return false;
        if (complaint.getStatus() == Complaint.IssueStatus.RESOLVED ||
            complaint.getStatus() == Complaint.IssueStatus.REJECTED) return false;
        LocalDateTime warningTime = complaint.getSlaDeadline().minusHours(2);
        return LocalDateTime.now().isAfter(warningTime) && LocalDateTime.now().isBefore(complaint.getSlaDeadline());
    }
}
