package com.smartportal.projectAllocation.model;

import jakarta.persistence.*;

@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String domainInterest;  // e.g., "AI and ML"

    public Student(Long id, String name, String email, String domainInterest) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.domainInterest = domainInterest;
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

    public String getDomainInterest() { return domainInterest; }

    public void setDomainInterest(String domainInterest) { this.domainInterest = domainInterest; }
}
