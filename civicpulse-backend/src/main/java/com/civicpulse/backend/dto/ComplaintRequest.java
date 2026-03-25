package com.civicpulse.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class ComplaintRequest {
    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String category;

    private double latitude;
    private double longitude;
    private String address;

    private List<String> images;
    private boolean anonymous;
}
