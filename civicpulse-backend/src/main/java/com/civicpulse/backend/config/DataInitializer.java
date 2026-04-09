package com.civicpulse.backend.config;

import com.civicpulse.backend.entity.Complaint;
import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.repository.ComplaintRepository;
import com.civicpulse.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (complaintRepository.count() > 0) return;

        // Create a dummy user if not exists
        User system = userRepository.findByEmail("system@civicpulse.gov").orElse(null);
        if (system == null) {
            system = User.builder()
                    .name("Civic System")
                    .email("system@civicpulse.gov")
                    .password(passwordEncoder.encode("system123"))
                    .phone("0000000000")
                    .role(User.UserRole.SUPER_ADMIN)
                    .build();
            system = userRepository.save(system);
        }

        // Trending Dummy Issues
        createIssue("Massive Pothole on M.G. Road", "Large pothole causing traffic jams near the main market.", 
                    Complaint.IssueCategory.ROAD, 85, system);
        
        createIssue("Faulty Streetlights in Ward 7", "The entire block has been dark for 3 days.", 
                    Complaint.IssueCategory.STREETLIGHT, 42, system);
        
        createIssue("Water Pipeline Leak", "Drinking water is being wasted on the street since morning.", 
                    Complaint.IssueCategory.WATER, 120, system);

        createIssue("Garbage Pile-up near School", "Health hazard due to uncollected waste for a week.", 
                    Complaint.IssueCategory.GARBAGE, 66, system);

        // Resolved issues for tracking
        createResolvedIssue("Open Drain Fixed", "Sewage line was repaired and covered.", 
                            Complaint.IssueCategory.DRAINAGE, system);
    }

    private void createIssue(String title, String desc, Complaint.IssueCategory cat, int upvotes, User reporter) {
        Complaint c = Complaint.builder()
                .title(title)
                .description(desc)
                .category(cat)
                .status(Complaint.IssueStatus.SUBMITTED)
                .priority(Complaint.IssuePriority.HIGH)
                .latitude(18.5204)
                .longitude(73.8567)
                .address("Pune City Center")
                .ward("Ward 1")
                .department("Civil Works")
                .reportedBy(reporter)
                .upvotes(upvotes)
                .reportedAt(LocalDateTime.now().minusDays(1))
                .build();
        complaintRepository.save(c);
    }

    private void createResolvedIssue(String title, String desc, Complaint.IssueCategory cat, User reporter) {
        Complaint c = Complaint.builder()
                .title(title)
                .description(desc)
                .category(cat)
                .status(Complaint.IssueStatus.RESOLVED)
                .priority(Complaint.IssuePriority.MEDIUM)
                .latitude(18.5204)
                .longitude(73.8567)
                .address("Shivaji Nagar")
                .ward("Ward 2")
                .department("Health")
                .reportedBy(reporter)
                .resolvedAt(LocalDateTime.now().minusHours(2))
                .reportedAt(LocalDateTime.now().minusDays(3))
                .build();
        complaintRepository.save(c);
    }
}
