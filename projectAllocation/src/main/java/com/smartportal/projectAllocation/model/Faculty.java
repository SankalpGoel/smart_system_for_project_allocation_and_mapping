package com.smartportal.projectAllocation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "faculty")
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

    private String orcid;
    private String scopus;

    // ===== NEW FIELDS FOR SLOT TRACKING =====
    
    @Column(name = "current_load")
    private Integer currentLoad = 0;
    
    @Column(name = "max_load")
    private Integer maxLoad = 3;

    // ===== CONSTRUCTORS =====
    
    public Faculty() {
        this.currentLoad = 0;
        this.maxLoad = 3;
    }

    public Faculty(String name, String email, String department, String domainExpertise, String orcid, String scopus) {
        this.name = name;
        this.email = email;
        this.department = department;
        this.domainExpertise = domainExpertise;
        this.orcid = orcid;
        this.scopus = scopus;
        this.currentLoad = 0;
        this.maxLoad = 3;
    }

    // ===== GETTERS AND SETTERS =====
    
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

    public String getOrcid() { return orcid; }
    public void setOrcid(String orcid) { this.orcid = orcid; }

    public String getScopus() { return scopus; }
    public void setScopus(String scopus) { this.scopus = scopus; }
    
    public Integer getCurrentLoad() { return currentLoad; }
    public void setCurrentLoad(Integer currentLoad) { this.currentLoad = currentLoad; }
    
    public Integer getMaxLoad() { return maxLoad; }
    public void setMaxLoad(Integer maxLoad) { this.maxLoad = maxLoad; }
    
    // ===== HELPER METHODS =====
    
    @Transient
    public Integer getAvailableSlots() {
        return maxLoad - currentLoad;
    }
    
    @Transient
    public boolean hasAvailableSlots() {
        return getAvailableSlots() > 0;
    }
}