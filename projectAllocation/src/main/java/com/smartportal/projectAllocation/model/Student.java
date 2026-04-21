package com.smartportal.projectAllocation.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(unique = true)
    private String email;
    
    private String projectTitle; 
    private String projectIdea;

    // Faculty assignment (confirmed)
    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty assignedFaculty;

    // Group assignment (after clustering)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private ProjectGroup group;

    // ===== NEW FIELDS FOR SELECTION WORKFLOW =====
    
    @Enumerated(EnumType.STRING)
    @Column(name = "selection_status")
    private SelectionStatus selectionStatus = SelectionStatus.PENDING;
    
    // Faculty that student has requested (but not yet confirmed)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_faculty_id")
    private Faculty requestedFaculty;
    
    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    // ===== CONSTRUCTORS =====
    
    public Student() {
        this.selectionStatus = SelectionStatus.PENDING;
    }

    public Student(Long id, String name, String email, String projectTitle, String projectIdea) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.projectTitle = projectTitle;
        this.projectIdea = projectIdea;
        this.selectionStatus = SelectionStatus.PENDING;
    }

    // ===== GETTERS AND SETTERS =====
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }
    
    public String getProjectIdea() { return projectIdea; }
    public void setProjectIdea(String projectIdea) { this.projectIdea = projectIdea; }
    
    public Faculty getAssignedFaculty() { return assignedFaculty; }
    public void setAssignedFaculty(Faculty assignedFaculty) { this.assignedFaculty = assignedFaculty; }
    
    public ProjectGroup getGroup() { return group; }
    public void setGroup(ProjectGroup group) { this.group = group; }
    
    public SelectionStatus getSelectionStatus() { return selectionStatus; }
    public void setSelectionStatus(SelectionStatus selectionStatus) { this.selectionStatus = selectionStatus; }
    
    public Faculty getRequestedFaculty() { return requestedFaculty; }
    public void setRequestedFaculty(Faculty requestedFaculty) { this.requestedFaculty = requestedFaculty; }
    
    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }
    
    // ===== SELECTION STATUS ENUM =====
    
    public enum SelectionStatus {
        PENDING,           // Student hasn't selected anyone yet
        REQUESTED,         // Student selected faculty, waiting for approval
        CONFIRMED,         // Faculty confirmed the request
        REJECTED,          // Faculty rejected the request
        AUTO_ASSIGNED,     // Auto-assigned after deadline via clustering
        EXPIRED            // Deadline passed without selection
    }
}