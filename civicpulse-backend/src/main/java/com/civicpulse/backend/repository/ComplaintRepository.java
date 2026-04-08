package com.civicpulse.backend.repository;

import com.civicpulse.backend.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, String> {

    List<Complaint> findByReportedByIdOrderByReportedAtDesc(String userId);

    List<Complaint> findByAssignedToIdOrderByReportedAtDesc(String workerId);

    List<Complaint> findByStatus(Complaint.IssueStatus status);

    List<Complaint> findByCategory(Complaint.IssueCategory category);

    List<Complaint> findByWard(String ward);

    List<Complaint> findByDepartment(String department);

    List<Complaint> findByStatusAndDepartment(Complaint.IssueStatus status, String department);

    @Query("SELECT c FROM Complaint c WHERE c.slaDeadline < :now AND c.status NOT IN ('RESOLVED', 'REJECTED')")
    List<Complaint> findSlaBreached(@Param("now") LocalDateTime now);

    @Query("SELECT c FROM Complaint c WHERE c.slaDeadline BETWEEN :now AND :warningTime AND c.status NOT IN ('RESOLVED', 'REJECTED')")
    List<Complaint> findSlaWarning(@Param("now") LocalDateTime now, @Param("warningTime") LocalDateTime warningTime);

    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countByCategory();

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countByStatus();

    @Query("SELECT c.department, COUNT(c) FROM Complaint c GROUP BY c.department")
    List<Object[]> countByDepartment();

    @Query("SELECT CAST(c.reportedAt AS date), COUNT(c) FROM Complaint c " +
           "WHERE c.reportedAt >= :since GROUP BY CAST(c.reportedAt AS date) ORDER BY CAST(c.reportedAt AS date)")
    List<Object[]> countPerDay(@Param("since") LocalDateTime since);

    @Query("SELECT c FROM Complaint c WHERE c.status NOT IN ('RESOLVED', 'REJECTED') ORDER BY " +
           "CASE c.priority WHEN 'CRITICAL' THEN 0 WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END, " +
           "c.reportedAt ASC")
    List<Complaint> findAllOpenOrderedByPriority();

    long countByStatus(Complaint.IssueStatus status);

    long countByPriority(Complaint.IssuePriority priority);

    long countByStatusAndAssignedToId(Complaint.IssueStatus status, String workerId);

    @Query("SELECT c FROM Complaint c WHERE c.assignedTo.id = :workerId AND c.status = 'RESOLVED' " +
           "AND c.resolvedAt >= :since")
    List<Complaint> findResolvedByWorkerSince(@Param("workerId") String workerId, @Param("since") LocalDateTime since);

    long countByStatusAndResolvedAtAfter(Complaint.IssueStatus status, LocalDateTime since);

    @Query("SELECT c.ward, c.category, COUNT(c) FROM Complaint c GROUP BY c.ward, c.category HAVING COUNT(c) > 1")
    List<Object[]> findRecurringHotspots();
}
