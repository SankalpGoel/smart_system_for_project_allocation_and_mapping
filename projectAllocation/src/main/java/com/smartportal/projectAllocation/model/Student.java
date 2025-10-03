package com.smartportal.projectAllocation.model;

import jakarta.persistence.*;

@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String projectTitle; 
    private String projectIdea; 

    public Student(Long id, String name, String email, String projectTitle, String projectIdea) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.projectTitle = projectTitle;
        this.projectIdea = projectIdea;
    }
    public Faculty getAssignedFaculty() {
        return assignedFaculty;
    }

    public void setAssignedFaculty(Faculty assignedFaculty) {
        this.assignedFaculty = assignedFaculty;
    }

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty assignedFaculty;



    // Getters & Setters
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
}
