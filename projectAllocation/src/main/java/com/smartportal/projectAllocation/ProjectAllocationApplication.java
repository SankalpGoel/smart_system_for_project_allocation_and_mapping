// Path: src/main/java/com/smartportal/projectAllocation/ProjectAllocationApplication.java

package com.smartportal.projectAllocation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // ✨ ADD THIS
public class ProjectAllocationApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProjectAllocationApplication.class, args);
    }
}