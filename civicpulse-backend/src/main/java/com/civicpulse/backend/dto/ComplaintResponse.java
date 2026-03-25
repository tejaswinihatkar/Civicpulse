package com.civicpulse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class ComplaintResponse {
    private String id;
    private String title;
    private String description;
    private String category;
    private String status;
    private String priority;

    private double latitude;
    private double longitude;
    private String address;
    private String ward;

    private String reportedById;
    private String reportedByName;
    private String assignedToId;
    private String assignedToName;
    private String department;

    private boolean anonymous;
    private int upvotes;
    private List<String> images;

    private LocalDateTime slaDeadline;
    private LocalDateTime reportedAt;
    private LocalDateTime acknowledgedAt;
    private LocalDateTime inProgressAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime updatedAt;

    private List<String> beforeImages;
    private List<String> afterImages;
    private String workNotes;

    private String sponsorName;
    private Double sponsorAmount;
}
