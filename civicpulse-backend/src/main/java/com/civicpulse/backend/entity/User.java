package com.civicpulse.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    private String avatar;
    private String department;
    private String ward;

    @Builder.Default
    private int points = 0;

    @Builder.Default
    private double rating = 0.0;

    @Builder.Default
    private int activeTasksCount = 0;

    @Builder.Default
    private int completedTasksCount = 0;

    @Builder.Default
    private double slaComplianceRate = 100.0;

    @Builder.Default
    private boolean anonymous = false;

    @Builder.Default
    private boolean enabled = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @Builder.Default
    private List<String> badges = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum UserRole {
        CITIZEN, AUTHORITY, WORKER, NGO, SUPER_ADMIN
    }
}
