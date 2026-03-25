package com.civicpulse.backend.config;

import com.civicpulse.backend.entity.*;
import com.civicpulse.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final WardMappingRepository wardMappingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;
        log.info("Seeding database with sample data...");

        // --- Users ---
        User citizen1 = userRepository.save(User.builder()
                .name("Rajesh Kumar").email("rajesh@example.com")
                .password(passwordEncoder.encode("password123")).phone("9876543210")
                .role(User.UserRole.CITIZEN).points(450)
                .badges(List.of("active-citizen", "community-leader"))
                .avatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200")
                .build());

        User citizen2 = userRepository.save(User.builder()
                .name("Priya Sharma").email("priya@example.com")
                .password(passwordEncoder.encode("password123")).phone("9876543211")
                .role(User.UserRole.CITIZEN).points(680)
                .badges(List.of("active-citizen", "clean-city-champion", "community-leader"))
                .avatar("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200")
                .build());

        User citizen3 = userRepository.save(User.builder()
                .name("Amit Patel").email("amit@example.com")
                .password(passwordEncoder.encode("password123")).phone("9876543212")
                .role(User.UserRole.CITIZEN).points(320)
                .badges(List.of("active-citizen"))
                .avatar("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200")
                .build());

        User authority = userRepository.save(User.builder()
                .name("Admin Officer").email("admin@gov.in")
                .password(passwordEncoder.encode("password123")).phone("9876543220")
                .role(User.UserRole.AUTHORITY).department("General Administration")
                .avatar("https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200")
                .build());

        User worker1 = userRepository.save(User.builder()
                .name("Suresh Singh").email("suresh@gov.in")
                .password(passwordEncoder.encode("password123")).phone("9876543230")
                .role(User.UserRole.WORKER).department("Public Works")
                .activeTasksCount(3).completedTasksCount(127).slaComplianceRate(94.5).rating(4.7)
                .avatar("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200")
                .build());

        User worker2 = userRepository.save(User.builder()
                .name("Ramesh Yadav").email("ramesh@gov.in")
                .password(passwordEncoder.encode("password123")).phone("9876543231")
                .role(User.UserRole.WORKER).department("Electricity")
                .activeTasksCount(2).completedTasksCount(203).slaComplianceRate(97.2).rating(4.9)
                .avatar("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200")
                .build());

        User worker3 = userRepository.save(User.builder()
                .name("Vijay Verma").email("vijay@gov.in")
                .password(passwordEncoder.encode("password123")).phone("9876543232")
                .role(User.UserRole.WORKER).department("Drainage")
                .activeTasksCount(4).completedTasksCount(156).slaComplianceRate(91.8).rating(4.6)
                .avatar("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200")
                .build());

        User ngo = userRepository.save(User.builder()
                .name("Clean City Foundation").email("ngo@cleancity.org")
                .password(passwordEncoder.encode("password123")).phone("9876543240")
                .role(User.UserRole.NGO)
                .avatar("https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200")
                .build());

        // --- Ward Mappings ---
        wardMappingRepository.save(WardMapping.builder()
                .wardName("Connaught Place").wardCode("WARD-CP").zone("Central Delhi")
                .department("Public Works")
                .minLatitude(28.6100).maxLatitude(28.6200)
                .minLongitude(77.2050).maxLongitude(77.2150)
                .officer(authority).build());

        wardMappingRepository.save(WardMapping.builder()
                .wardName("Karol Bagh").wardCode("WARD-KB").zone("Central Delhi")
                .department("Sanitation")
                .minLatitude(28.6400).maxLatitude(28.6600)
                .minLongitude(77.1800).maxLongitude(77.2100)
                .officer(authority).build());

        wardMappingRepository.save(WardMapping.builder()
                .wardName("Model Town").wardCode("WARD-MT").zone("North Delhi")
                .department("Water Supply")
                .minLatitude(28.7100).maxLatitude(28.7300)
                .minLongitude(77.1800).maxLongitude(77.2050)
                .officer(authority).build());

        // --- Complaints ---
        complaintRepository.save(Complaint.builder()
                .title("Pothole on Main Street")
                .description("Large pothole causing traffic issues and vehicle damage")
                .category(Complaint.IssueCategory.ROAD)
                .status(Complaint.IssueStatus.IN_PROGRESS)
                .priority(Complaint.IssuePriority.HIGH)
                .latitude(28.6139).longitude(77.2090)
                .address("Main Street, Connaught Place, New Delhi")
                .ward("WARD-CP").department("Public Works")
                .reportedBy(citizen1).assignedTo(worker1)
                .upvotes(45)
                .images(List.of("https://images.unsplash.com/photo-1625465809518-56046973ecb7?w=800"))
                .slaDeadline(LocalDateTime.now().plusHours(6))
                .reportedAt(LocalDateTime.now().minusDays(2))
                .acknowledgedAt(LocalDateTime.now().minusDays(1))
                .inProgressAt(LocalDateTime.now().minusHours(12))
                .build());

        complaintRepository.save(Complaint.builder()
                .title("Overflowing garbage bins near park")
                .description("Multiple garbage bins overflowing, creating hygiene issues")
                .category(Complaint.IssueCategory.GARBAGE)
                .status(Complaint.IssueStatus.SUBMITTED)
                .priority(Complaint.IssuePriority.CRITICAL)
                .latitude(28.6145).longitude(77.2088)
                .address("Central Park, Sector 15, New Delhi")
                .ward("WARD-CP").department("Sanitation")
                .reportedBy(citizen2)
                .upvotes(78)
                .images(List.of("https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800"))
                .slaDeadline(LocalDateTime.now().plusHours(2))
                .reportedAt(LocalDateTime.now().minusDays(1))
                .build());

        complaintRepository.save(Complaint.builder()
                .title("Streetlight not working")
                .description("Dark street at night, safety concern for pedestrians")
                .category(Complaint.IssueCategory.STREETLIGHT)
                .status(Complaint.IssueStatus.RESOLVED)
                .priority(Complaint.IssuePriority.MEDIUM)
                .latitude(28.6150).longitude(77.2085)
                .address("Park Lane, Sector 12, New Delhi")
                .ward("WARD-CP").department("Electricity")
                .reportedBy(citizen3).assignedTo(worker2)
                .upvotes(23)
                .images(List.of("https://images.unsplash.com/photo-1518331368925-fd8d678638d0?w=800"))
                .slaDeadline(LocalDateTime.now().minusDays(2))
                .reportedAt(LocalDateTime.now().minusDays(4))
                .acknowledgedAt(LocalDateTime.now().minusDays(3))
                .inProgressAt(LocalDateTime.now().minusDays(3))
                .resolvedAt(LocalDateTime.now().minusDays(2))
                .completedAt(LocalDateTime.now().minusDays(2))
                .beforeImages(List.of("https://images.unsplash.com/photo-1518331368925-fd8d678638d0?w=800"))
                .afterImages(List.of("https://images.unsplash.com/photo-1509062522202-dfbf8f77873f?w=800"))
                .workNotes("Replaced faulty bulb and fixed wiring")
                .build());

        complaintRepository.save(Complaint.builder()
                .title("Water leakage from main pipeline")
                .description("Continuous water leakage wasting precious water resources")
                .category(Complaint.IssueCategory.WATER)
                .status(Complaint.IssueStatus.ACKNOWLEDGED)
                .priority(Complaint.IssuePriority.CRITICAL)
                .latitude(28.6135).longitude(77.2095)
                .address("Model Town, New Delhi")
                .ward("WARD-MT").department("Water Supply")
                .reportedBy(citizen1)
                .upvotes(92)
                .images(List.of("https://images.unsplash.com/photo-1584555684040-bad07c4833f5?w=800"))
                .slaDeadline(LocalDateTime.now().plusHours(1))
                .reportedAt(LocalDateTime.now().minusDays(1))
                .acknowledgedAt(LocalDateTime.now().minusHours(12))
                .build());

        complaintRepository.save(Complaint.builder()
                .title("Blocked drainage causing waterlogging")
                .description("Heavy waterlogging during rain due to blocked drainage")
                .category(Complaint.IssueCategory.DRAINAGE)
                .status(Complaint.IssueStatus.IN_PROGRESS)
                .priority(Complaint.IssuePriority.HIGH)
                .latitude(28.6142).longitude(77.2082)
                .address("Rajendra Place, New Delhi")
                .ward("WARD-CP").department("Drainage")
                .reportedBy(citizen2).assignedTo(worker3)
                .upvotes(67)
                .images(List.of("https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800"))
                .slaDeadline(LocalDateTime.now().plusDays(1))
                .reportedAt(LocalDateTime.now().minusDays(2))
                .acknowledgedAt(LocalDateTime.now().minusDays(1))
                .inProgressAt(LocalDateTime.now().minusHours(6))
                .sponsorId(ngo.getId()).sponsorName("Clean City Foundation").sponsorAmount(50000.0)
                .build());

        complaintRepository.save(Complaint.builder()
                .title("Illegal dumping in residential area")
                .description("Construction waste illegally dumped in residential area")
                .category(Complaint.IssueCategory.GARBAGE)
                .status(Complaint.IssueStatus.SUBMITTED)
                .priority(Complaint.IssuePriority.HIGH)
                .latitude(28.6148).longitude(77.2078)
                .address("Karol Bagh, New Delhi")
                .ward("WARD-KB").department("Sanitation")
                .reportedBy(citizen1)
                .upvotes(54)
                .images(List.of("https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800"))
                .slaDeadline(LocalDateTime.now().plusHours(8))
                .reportedAt(LocalDateTime.now().minusHours(18))
                .build());

        complaintRepository.save(Complaint.builder()
                .title("Traffic signal malfunction")
                .description("Traffic signal stuck on red, causing major congestion")
                .category(Complaint.IssueCategory.TRAFFIC)
                .status(Complaint.IssueStatus.ACKNOWLEDGED)
                .priority(Complaint.IssuePriority.CRITICAL)
                .latitude(28.6137).longitude(77.2092)
                .address("Outer Circle, Connaught Place, New Delhi")
                .ward("WARD-CP").department("Traffic Management")
                .reportedBy(citizen2)
                .upvotes(112)
                .images(List.of("https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800"))
                .slaDeadline(LocalDateTime.now().plusHours(2))
                .reportedAt(LocalDateTime.now().minusHours(6))
                .acknowledgedAt(LocalDateTime.now().minusHours(4))
                .build());

        complaintRepository.save(Complaint.builder()
                .title("Broken park bench and damaged equipment")
                .description("Children's park equipment damaged and needs repair")
                .category(Complaint.IssueCategory.PARK)
                .status(Complaint.IssueStatus.SUBMITTED)
                .priority(Complaint.IssuePriority.MEDIUM)
                .latitude(28.6152).longitude(77.2087)
                .address("Community Park, Sector 18, New Delhi")
                .ward("WARD-CP").department("Parks & Recreation")
                .reportedBy(citizen3)
                .upvotes(31)
                .images(List.of("https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800"))
                .slaDeadline(LocalDateTime.now().plusDays(3))
                .reportedAt(LocalDateTime.now().minusDays(2))
                .build());

        log.info("Database seeded successfully with {} users, {} complaints, {} wards",
                userRepository.count(), complaintRepository.count(), wardMappingRepository.count());
    }
}
