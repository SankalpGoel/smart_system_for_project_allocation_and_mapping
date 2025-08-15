package com.smartportal.projectAllocation.repository;

import com.smartportal.projectAllocation.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Faculty findByEmail(String email);
}
