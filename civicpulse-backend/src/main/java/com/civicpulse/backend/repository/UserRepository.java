package com.civicpulse.backend.repository;

import com.civicpulse.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(User.UserRole role);

    List<User> findByRoleAndDepartment(User.UserRole role, String department);

    @Query("SELECT u FROM User u WHERE u.role = 'WORKER' ORDER BY u.completedTasksCount DESC")
    List<User> findTopWorkers();

    List<User> findByWard(String ward);

    @Query("SELECT u FROM User u WHERE u.role = 'CITIZEN' ORDER BY u.points DESC")
    List<User> findTopCitizens();
}
