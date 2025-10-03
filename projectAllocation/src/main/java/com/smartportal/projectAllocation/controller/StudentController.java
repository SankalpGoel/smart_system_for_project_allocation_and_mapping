package com.smartportal.projectAllocation.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartportal.projectAllocation.model.Faculty;
import com.smartportal.projectAllocation.model.Student;
import com.smartportal.projectAllocation.repository.FacultyRepository;
import com.smartportal.projectAllocation.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private RestTemplate restTemplate;

    /**
     * Register a student and automatically recommend + assign a faculty
     */
    @PostMapping("/register")
    public ResponseEntity<Student> registerStudent(@RequestBody Student student) {

        // Step 1: Save student first (basic info)
        Student savedStudent = studentRepository.save(student);

        // Step 2: Fetch all faculty from DB
        List<Faculty> allFaculty = facultyRepository.findAll();

        // Step 3: Prepare payload for ML recommender
        List<Map<String, String>> facultyPayload = allFaculty.stream().map(fac -> {
            Map<String, String> map = new HashMap<>();
            map.put("name", fac.getName());
            map.put("email", fac.getEmail());
            map.put("domainExpertise", fac.getDomainExpertise());
            return map;
        }).toList();

        // Combine project title + idea as one string for semantic matching
        String combinedText = student.getProjectTitle() + " " + student.getProjectIdea();

        Map<String, Object> requestPayload = new HashMap<>();
        requestPayload.put("student_project", combinedText);
        requestPayload.put("faculty", facultyPayload);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestPayload, headers);

        try {
            // Step 4: Call Flask recommender
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "http://localhost:5001/recommend-faculty", 
                    httpEntity, 
                    String.class
            );

            // Step 5: Parse ML service response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            // Pick the top-1 faculty recommendation
            String topFacultyEmail = root.get("recommendations").get(0).get("email").asText();

            Faculty matched = facultyRepository.findByEmail(topFacultyEmail);

            // Step 6: Assign faculty to student
            savedStudent.setAssignedFaculty(matched);
            Student finalStudent = studentRepository.save(savedStudent);

            return ResponseEntity.ok(finalStudent);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(student);
        }
    }

    /**
     * Endpoint for testing recommendations without saving student
     */
    @PostMapping("/recommend")
    public ResponseEntity<?> recommendFaculty(@RequestBody Map<String, String> payload) {
        String projectTitle = payload.get("projectTitle");
        String projectIdea = payload.get("projectIdea");
        String combinedText = projectTitle + " " + projectIdea;

        List<Faculty> allFaculty = facultyRepository.findAll();

        List<Map<String, String>> facultyPayload = allFaculty.stream().map(fac -> {
            Map<String, String> map = new HashMap<>();
            map.put("name", fac.getName());
            map.put("email", fac.getEmail());
            map.put("domainExpertise", fac.getDomainExpertise());
            return map;
        }).toList();

        Map<String, Object> requestPayload = new HashMap<>();
        requestPayload.put("student_project", combinedText);
        requestPayload.put("faculty", facultyPayload);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestPayload, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:5001/recommend-faculty", 
                httpEntity, 
                String.class
        );
        return ResponseEntity.ok(response.getBody());
    }

    /**
     * CRUD APIs
     */
    @PostMapping
    public Student saveStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{email}")
    public Student getStudentByEmail(@PathVariable String email) {
        return studentRepository.findByEmail(email);
    }
}
