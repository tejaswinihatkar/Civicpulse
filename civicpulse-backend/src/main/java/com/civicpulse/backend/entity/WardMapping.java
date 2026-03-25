package com.civicpulse.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ward_mappings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WardMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String wardName;

    @Column(nullable = false)
    private String wardCode;

    private String zone;

    @Column(nullable = false)
    private String department;

    // Bounding box for geo-lookup
    private double minLatitude;
    private double maxLatitude;
    private double minLongitude;
    private double maxLongitude;

    // Officer in charge
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "officer_id")
    private User officer;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
