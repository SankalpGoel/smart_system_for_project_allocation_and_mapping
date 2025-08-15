package com.smartportal.projectAllocation.model;

import jakarta.persistence.*;

@Entity
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String department;

    @Column(name="domainExpertise", columnDefinition = "TEXT")
    private String domainExpertise; 

    // Constructors
    public Faculty() {}

    public Faculty(String name, String email, String department, String domainExpertise) {
        this.name = name;
        this.email = email;
        this.department = department;
        this.domainExpertise = domainExpertise;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }

    public void setDepartment(String department) { this.department = department; }

    public String getDomainExpertise() { return domainExpertise; }

    public void setDomainExpertise(String domainExpertise) { this.domainExpertise = domainExpertise; }

    private String orcid;
    private String scopus;

    public String getOrcid() { return orcid; }
    public void setOrcid(String orcid) { this.orcid = orcid; }

    public String getScopus() { return scopus; }
    public void setScopus(String scopus) { this.scopus = scopus; }

}
