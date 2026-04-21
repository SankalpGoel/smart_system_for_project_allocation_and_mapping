package com.smartportal.projectAllocation.repository;

import com.smartportal.projectAllocation.model.Student;
import com.smartportal.projectAllocation.model.Student.SelectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Student findByEmail(String email);
    
    // Find students without groups
    List<Student> findByGroupIsNull();
    
    // Find students who haven't selected/confirmed faculty yet
    @Query("SELECT s FROM Student s WHERE s.selectionStatus IN ('PENDING', 'REJECTED', 'EXPIRED') AND s.assignedFaculty IS NULL")
    List<Student> findStudentsWithoutConfirmedFaculty();
    
    // Find students with pending requests
    List<Student> findBySelectionStatus(SelectionStatus status);
    
    // Find students waiting for specific faculty approval
    @Query("SELECT s FROM Student s WHERE s.requestedFaculty.id = :facultyId AND s.selectionStatus = 'REQUESTED'")
    List<Student> findPendingRequestsForFaculty(Long facultyId);
    
    // Count unassigned students
    @Query("SELECT COUNT(s) FROM Student s WHERE s.assignedFaculty IS NULL AND s.selectionStatus != 'AUTO_ASSIGNED'")
    long countUnassignedStudents();
}

