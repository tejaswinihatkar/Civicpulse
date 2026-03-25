package com.civicpulse.backend.repository;

import com.civicpulse.backend.entity.WardMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface WardMappingRepository extends JpaRepository<WardMapping, String> {

    @Query("SELECT w FROM WardMapping w WHERE :lat BETWEEN w.minLatitude AND w.maxLatitude " +
           "AND :lng BETWEEN w.minLongitude AND w.maxLongitude")
    Optional<WardMapping> findByCoordinates(@Param("lat") double lat, @Param("lng") double lng);

    Optional<WardMapping> findByWardCode(String wardCode);

    List<WardMapping> findByDepartment(String department);
}
