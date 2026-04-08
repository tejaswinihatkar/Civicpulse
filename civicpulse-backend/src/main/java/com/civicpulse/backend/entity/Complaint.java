package com.civicpulse.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private IssueStatus status = IssueStatus.SUBMITTED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private IssuePriority priority = IssuePriority.MEDIUM;

    // Location
    private double latitude;
    private double longitude;
    private String address;
    private String ward;

    // Relationships
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reported_by")
    private User reportedBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    private String department;

    @Builder.Default
    private boolean anonymous = false;

    @Builder.Default
    private int upvotes = 0;

    @ElementCollection(fetch = FetchType.EAGER)
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    // SLA
    private LocalDateTime slaDeadline;

    // Proof of work
    @ElementCollection(fetch = FetchType.EAGER)
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    @Builder.Default
    private List<String> beforeImages = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    @Builder.Default
    private List<String> afterImages = new ArrayList<>();

    private String workNotes;
    private LocalDateTime completedAt;

    // Timestamps
    private LocalDateTime reportedAt;
    private LocalDateTime acknowledgedAt;
    private LocalDateTime inProgressAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime rejectedAt;
    private LocalDateTime updatedAt;

    // Sponsorship
    private String sponsorId;
    private String sponsorName;
    private Double sponsorAmount;

    @PrePersist
    protected void onCreate() {
        reportedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum IssueCategory {
        ROAD, GARBAGE, ELECTRICITY, WATER, DRAINAGE, STREETLIGHT, PARK, TRAFFIC, OTHER
    }

    public enum IssueStatus {
        SUBMITTED, ACKNOWLEDGED, IN_PROGRESS, RESOLVED, REJECTED
    }

    public enum IssuePriority {
        CRITICAL, HIGH, MEDIUM, LOW
    }
}
