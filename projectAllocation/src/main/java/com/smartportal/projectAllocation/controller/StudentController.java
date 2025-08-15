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

    @PostMapping("/register")
    public ResponseEntity<Student> registerStudent(@RequestBody Student student) {

    // Save student temporarily to get domain
        Student savedStudent = studentRepository.save(student);

    // Prepare request for ML recommender
        List<Faculty> allFaculty = facultyRepository.findAll();
        List<Map<String, String>> facultyPayload = allFaculty.stream().map(fac -> {
            Map<String, String> map = new HashMap<>();
            map.put("name", fac.getName());
            map.put("email", fac.getEmail());
            map.put("domainExpertise", fac.getDomainExpertise());
            return map;
        }).toList();

        Map<String, Object> request = new HashMap<>();
        request.put("student_domain", student.getDomainInterest());
        request.put("faculty", facultyPayload);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity("http://localhost:5001/recommend-faculty", httpEntity, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            String topFacultyEmail = root.get("recommendations").get(0).get("email").asText();

            Faculty matched = facultyRepository.findByEmail(topFacultyEmail);
            savedStudent.setAssignedFaculty(matched);
            Student finalStudent = studentRepository.save(savedStudent);

            return ResponseEntity.ok(finalStudent);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(student);
        }
    }

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private RestTemplate restTemplate;
    
    @PostMapping("/recommend")
    public ResponseEntity<?> recommendFaculty(@RequestBody Map<String, String> payload) {
        String studentDomain = payload.get("domain");

        List<Faculty> allFaculty = facultyRepository.findAll();

        List<Map<String, String>> facultyPayload = allFaculty.stream().map(fac -> {
            Map<String, String> map = new HashMap<>();
            map.put("name", fac.getName());
            map.put("email", fac.getEmail());
            map.put("domainExpertise", fac.getDomainExpertise());
            return map;
        }).toList();

        Map<String, Object> request = new HashMap<>();
        request.put("student_domain", studentDomain);
        request.put("faculty", facultyPayload);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(request, headers);

        ResponseEntity<String> response = restTemplate.postForEntity("http://localhost:5001/recommend-faculty", httpEntity, String.class);
        return ResponseEntity.ok(response.getBody());
    }

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
