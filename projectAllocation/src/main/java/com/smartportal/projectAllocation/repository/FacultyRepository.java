package com.smartportal.projectAllocation.repository;

import com.smartportal.projectAllocation.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Faculty findByEmail(String email);
    
    // Find faculty with available slots
    @Query("SELECT f FROM Faculty f WHERE f.currentLoad < f.maxLoad")
    List<Faculty> findAvailableFaculty();
}