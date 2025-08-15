package com.smartportal.projectAllocation.repository;

import com.smartportal.projectAllocation.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Student findByEmail(String email);
}
