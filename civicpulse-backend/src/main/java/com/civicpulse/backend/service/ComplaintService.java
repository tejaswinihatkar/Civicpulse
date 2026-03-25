package com.civicpulse.backend.service;

import com.civicpulse.backend.dto.ComplaintRequest;
import com.civicpulse.backend.dto.ComplaintResponse;
import com.civicpulse.backend.entity.Complaint;
import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.repository.ComplaintRepository;
import com.civicpulse.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final RoutingService routingService;
    private final NotificationService notificationService;
    private final SlaService slaService;

    @Value("${app.sla.critical:4}")
    private int slaCriticalHours;

    @Value("${app.sla.high:12}")
    private int slaHighHours;

    @Value("${app.sla.medium:48}")
    private int slaMediumHours;

    @Value("${app.sla.low:120}")
    private int slaLowHours;

    /**
     * Submit a new complaint — core citizen flow
     */
    @Transactional
    public ComplaintResponse submitComplaint(ComplaintRequest request, String userId) {
        User citizen = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Parse category
        Complaint.IssueCategory category;
        try {
            category = Complaint.IssueCategory.valueOf(request.getCategory().toUpperCase());
        } catch (Exception e) {
            category = Complaint.IssueCategory.OTHER;
        }

        // Smart routing: auto-detect ward + department
        String ward = routingService.detectWard(request.getLatitude(), request.getLongitude());
        String department = routingService.routeToDepartment(category);

        // AI priority detection (rule-based for now)
        Complaint.IssuePriority priority = detectPriority(category, request.getDescription());

        // Calculate SLA deadline
        LocalDateTime slaDeadline = slaService.calculateDeadline(priority);

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .status(Complaint.IssueStatus.SUBMITTED)
                .priority(priority)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .ward(ward)
                .department(department)
                .reportedBy(request.isAnonymous() ? null : citizen)
                .anonymous(request.isAnonymous())
                .images(request.getImages() != null ? request.getImages() : List.of())
                .slaDeadline(slaDeadline)
                .build();

        complaint = complaintRepository.save(complaint);

        // Update citizen points
        citizen.setPoints(citizen.getPoints() + 10);
        userRepository.save(citizen);

        // Send notification
        if (!request.isAnonymous()) {
            notificationService.notifyComplaintSubmitted(complaint);
        }

        return toResponse(complaint);
    }

    /**
     * Get all complaints with optional filters
     */
    public List<ComplaintResponse> getComplaints(String status, String category, String department, String ward) {
        List<Complaint> complaints;

        if (status != null && !status.isEmpty()) {
            Complaint.IssueStatus issueStatus = Complaint.IssueStatus.valueOf(status.toUpperCase().replace("-", "_"));
            if (department != null && !department.isEmpty()) {
                complaints = complaintRepository.findByStatusAndDepartment(issueStatus, department);
            } else {
                complaints = complaintRepository.findByStatus(issueStatus);
            }
        } else if (category != null && !category.isEmpty()) {
            complaints = complaintRepository.findByCategory(Complaint.IssueCategory.valueOf(category.toUpperCase()));
        } else if (department != null && !department.isEmpty()) {
            complaints = complaintRepository.findByDepartment(department);
        } else if (ward != null && !ward.isEmpty()) {
            complaints = complaintRepository.findByWard(ward);
        } else {
            complaints = complaintRepository.findAllOpenOrderedByPriority();
        }

        return complaints.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Get complaints for a specific citizen
     */
    public List<ComplaintResponse> getMyComplaints(String userId) {
        return complaintRepository.findByReportedByIdOrderByReportedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Get complaints assigned to a worker
     */
    public List<ComplaintResponse> getWorkerTasks(String workerId) {
        return complaintRepository.findByAssignedToIdOrderByReportedAtDesc(workerId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Get a single complaint by ID
     */
    public ComplaintResponse getComplaint(String id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return toResponse(complaint);
    }

    /**
     * Authority: Acknowledge a complaint
     */
    @Transactional
    public ComplaintResponse acknowledgeComplaint(String id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(Complaint.IssueStatus.ACKNOWLEDGED);
        complaint.setAcknowledgedAt(LocalDateTime.now());
        complaint = complaintRepository.save(complaint);

        notificationService.notifyStatusChange(complaint, Complaint.IssueStatus.ACKNOWLEDGED);
        return toResponse(complaint);
    }

    /**
     * Authority: Assign complaint to a worker
     */
    @Transactional
    public ComplaintResponse assignToWorker(String complaintId, String workerId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        complaint.setAssignedTo(worker);
        complaint.setStatus(Complaint.IssueStatus.ACKNOWLEDGED);
        complaint.setAcknowledgedAt(LocalDateTime.now());
        complaint = complaintRepository.save(complaint);

        // Update worker tasks count
        worker.setActiveTasksCount(worker.getActiveTasksCount() + 1);
        userRepository.save(worker);

        notificationService.notifyStatusChange(complaint, Complaint.IssueStatus.ACKNOWLEDGED);
        return toResponse(complaint);
    }

    /**
     * Worker: Start working on a complaint
     */
    @Transactional
    public ComplaintResponse startWork(String id, String workerId) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(Complaint.IssueStatus.IN_PROGRESS);
        complaint.setInProgressAt(LocalDateTime.now());
        complaint = complaintRepository.save(complaint);

        notificationService.notifyStatusChange(complaint, Complaint.IssueStatus.IN_PROGRESS);
        return toResponse(complaint);
    }

    /**
     * Worker: Upload proof and resolve complaint
     */
    @Transactional
    public ComplaintResponse resolveComplaint(String id, String workerId,
                                              List<String> beforeImages, List<String> afterImages, String workNotes) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(Complaint.IssueStatus.RESOLVED);
        complaint.setResolvedAt(LocalDateTime.now());
        complaint.setCompletedAt(LocalDateTime.now());
        complaint.setBeforeImages(beforeImages != null ? beforeImages : List.of());
        complaint.setAfterImages(afterImages != null ? afterImages : List.of());
        complaint.setWorkNotes(workNotes);
        complaint = complaintRepository.save(complaint);

        // Update worker stats
        User worker = complaint.getAssignedTo();
        if (worker != null) {
            worker.setActiveTasksCount(Math.max(0, worker.getActiveTasksCount() - 1));
            worker.setCompletedTasksCount(worker.getCompletedTasksCount() + 1);
            // Update SLA compliance
            if (complaint.getSlaDeadline() != null && LocalDateTime.now().isBefore(complaint.getSlaDeadline())) {
                // Recalculate SLA compliance rate
                double total = worker.getCompletedTasksCount();
                double currentCompliant = total * worker.getSlaComplianceRate() / 100.0;
                worker.setSlaComplianceRate(Math.round((currentCompliant + 1) / total * 100.0 * 10.0) / 10.0);
            }
            userRepository.save(worker);
        }

        // Award citizen points
        if (complaint.getReportedBy() != null) {
            User citizen = complaint.getReportedBy();
            citizen.setPoints(citizen.getPoints() + 25);
            userRepository.save(citizen);
        }

        notificationService.notifyStatusChange(complaint, Complaint.IssueStatus.RESOLVED);
        return toResponse(complaint);
    }

    /**
     * Authority: Reject a complaint
     */
    @Transactional
    public ComplaintResponse rejectComplaint(String id, String reason) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(Complaint.IssueStatus.REJECTED);
        complaint.setRejectedAt(LocalDateTime.now());
        complaint.setWorkNotes(reason);
        complaint = complaintRepository.save(complaint);

        notificationService.notifyStatusChange(complaint, Complaint.IssueStatus.REJECTED);
        return toResponse(complaint);
    }

    /**
     * Upvote a complaint
     */
    @Transactional
    public ComplaintResponse upvoteComplaint(String id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setUpvotes(complaint.getUpvotes() + 1);

        // Auto-escalate if many upvotes
        if (complaint.getUpvotes() >= 50 && complaint.getPriority() == Complaint.IssuePriority.MEDIUM) {
            complaint.setPriority(Complaint.IssuePriority.HIGH);
        } else if (complaint.getUpvotes() >= 100 && complaint.getPriority() == Complaint.IssuePriority.HIGH) {
            complaint.setPriority(Complaint.IssuePriority.CRITICAL);
        }

        complaint = complaintRepository.save(complaint);
        return toResponse(complaint);
    }

    /**
     * Simple AI-based priority detection
     */
    private Complaint.IssuePriority detectPriority(Complaint.IssueCategory category, String description) {
        // Critical categories
        if (category == Complaint.IssueCategory.WATER || category == Complaint.IssueCategory.ELECTRICITY) {
            return Complaint.IssuePriority.HIGH;
        }
        if (category == Complaint.IssueCategory.TRAFFIC) {
            return Complaint.IssuePriority.CRITICAL;
        }

        // Check description keywords
        if (description != null) {
            String lower = description.toLowerCase();
            if (lower.contains("danger") || lower.contains("emergency") || lower.contains("accident") || lower.contains("urgent")) {
                return Complaint.IssuePriority.CRITICAL;
            }
            if (lower.contains("safety") || lower.contains("flood") || lower.contains("leak")) {
                return Complaint.IssuePriority.HIGH;
            }
        }

        return Complaint.IssuePriority.MEDIUM;
    }

    /**
     * Convert entity to response DTO
     */
    public ComplaintResponse toResponse(Complaint c) {
        return ComplaintResponse.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .category(c.getCategory().name().toLowerCase())
                .status(c.getStatus().name().toLowerCase().replace("_", "-"))
                .priority(c.getPriority().name().toLowerCase())
                .latitude(c.getLatitude())
                .longitude(c.getLongitude())
                .address(c.getAddress())
                .ward(c.getWard())
                .reportedById(c.getReportedBy() != null ? c.getReportedBy().getId() : null)
                .reportedByName(c.isAnonymous() ? "Anonymous" : (c.getReportedBy() != null ? c.getReportedBy().getName() : null))
                .assignedToId(c.getAssignedTo() != null ? c.getAssignedTo().getId() : null)
                .assignedToName(c.getAssignedTo() != null ? c.getAssignedTo().getName() : null)
                .department(c.getDepartment())
                .anonymous(c.isAnonymous())
                .upvotes(c.getUpvotes())
                .images(c.getImages())
                .slaDeadline(c.getSlaDeadline())
                .reportedAt(c.getReportedAt())
                .acknowledgedAt(c.getAcknowledgedAt())
                .inProgressAt(c.getInProgressAt())
                .resolvedAt(c.getResolvedAt())
                .updatedAt(c.getUpdatedAt())
                .beforeImages(c.getBeforeImages())
                .afterImages(c.getAfterImages())
                .workNotes(c.getWorkNotes())
                .sponsorName(c.getSponsorName())
                .sponsorAmount(c.getSponsorAmount())
                .build();
    }
}
