package com.civicpulse.backend.controller;

import com.civicpulse.backend.dto.ComplaintRequest;
import com.civicpulse.backend.dto.ComplaintResponse;
import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    /**
     * Citizen: Submit a new complaint
     */
    @PostMapping
    public ResponseEntity<ComplaintResponse> submitComplaint(
            @Valid @RequestBody ComplaintRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(complaintService.submitComplaint(request, user.getId()));
    }

    /**
     * Get all complaints (with optional filters)
     */
    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String ward) {
        return ResponseEntity.ok(complaintService.getComplaints(status, category, department, ward));
    }

    /**
     * Get a specific complaint
     */
    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaint(@PathVariable String id) {
        return ResponseEntity.ok(complaintService.getComplaint(id));
    }

    /**
     * Citizen: Get my complaints
     */
    @GetMapping("/my")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(complaintService.getMyComplaints(user.getId()));
    }

    /**
     * Worker: Get my assigned tasks
     */
    @GetMapping("/worker/tasks")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<ComplaintResponse>> getWorkerTasks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(complaintService.getWorkerTasks(user.getId()));
    }

    /**
     * Authority: Acknowledge a complaint
     */
    @PatchMapping("/{id}/acknowledge")
    @PreAuthorize("hasRole('AUTHORITY') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ComplaintResponse> acknowledgeComplaint(@PathVariable String id) {
        return ResponseEntity.ok(complaintService.acknowledgeComplaint(id));
    }

    /**
     * Authority: Assign to a worker
     */
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('AUTHORITY') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ComplaintResponse> assignToWorker(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(complaintService.assignToWorker(id, body.get("workerId")));
    }

    /**
     * Worker: Start work on a complaint
     */
    @PatchMapping("/{id}/start")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<ComplaintResponse> startWork(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(complaintService.startWork(id, user.getId()));
    }

    /**
     * Worker: Resolve a complaint (with proof)
     */
    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<ComplaintResponse> resolveComplaint(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<String> beforeImages = (List<String>) body.get("beforeImages");
        @SuppressWarnings("unchecked")
        List<String> afterImages = (List<String>) body.get("afterImages");
        String workNotes = (String) body.get("workNotes");

        return ResponseEntity.ok(complaintService.resolveComplaint(
                id, user.getId(), beforeImages, afterImages, workNotes));
    }

    /**
     * Authority: Reject a complaint
     */
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('AUTHORITY') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ComplaintResponse> rejectComplaint(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(complaintService.rejectComplaint(id, body.get("reason")));
    }

    /**
     * Citizen: Upvote a complaint
     */
    @PostMapping("/{id}/upvote")
    public ResponseEntity<ComplaintResponse> upvoteComplaint(@PathVariable String id) {
        return ResponseEntity.ok(complaintService.upvoteComplaint(id));
    }
}
