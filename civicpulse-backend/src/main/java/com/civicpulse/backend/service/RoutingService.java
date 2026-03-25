package com.civicpulse.backend.service;

import com.civicpulse.backend.entity.Complaint;
import com.civicpulse.backend.entity.WardMapping;
import com.civicpulse.backend.repository.WardMappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoutingService {

    private final WardMappingRepository wardMappingRepository;

    // Category -> Department mapping for smart routing
    private static final Map<Complaint.IssueCategory, String> CATEGORY_DEPARTMENT_MAP = Map.of(
        Complaint.IssueCategory.ROAD, "Public Works",
        Complaint.IssueCategory.GARBAGE, "Sanitation",
        Complaint.IssueCategory.ELECTRICITY, "Electricity",
        Complaint.IssueCategory.WATER, "Water Supply",
        Complaint.IssueCategory.DRAINAGE, "Drainage",
        Complaint.IssueCategory.STREETLIGHT, "Electricity",
        Complaint.IssueCategory.PARK, "Parks & Recreation",
        Complaint.IssueCategory.TRAFFIC, "Traffic Management"
    );

    /**
     * Auto-detect ward based on GPS coordinates
     */
    public String detectWard(double latitude, double longitude) {
        Optional<WardMapping> ward = wardMappingRepository.findByCoordinates(latitude, longitude);
        return ward.map(WardMapping::getWardCode).orElse("WARD-DEFAULT");
    }

    /**
     * Smart route to correct department based on issue category
     */
    public String routeToDepartment(Complaint.IssueCategory category) {
        return CATEGORY_DEPARTMENT_MAP.getOrDefault(category, "General");
    }

    /**
     * Get the ward name for display
     */
    public String getWardName(double latitude, double longitude) {
        Optional<WardMapping> ward = wardMappingRepository.findByCoordinates(latitude, longitude);
        return ward.map(WardMapping::getWardName).orElse("Unknown Ward");
    }
}
