package com.smartportal.projectAllocation.controller;

// import com.fasterxml.jackson.databind.JsonNode;
// import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartportal.projectAllocation.model.Faculty;
import com.smartportal.projectAllocation.model.Student;
import com.smartportal.projectAllocation.repository.FacultyRepository;
import com.smartportal.projectAllocation.repository.StudentRepository;
import com.smartportal.projectAllocation.service.StudentSelectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private StudentSelectionService selectionService;

    /**
     * ✨ NEW: Get recommendations for a student (without auto-assigning)
     */
    @PostMapping("/{studentId}/get-recommendations")
    public ResponseEntity<?> getRecommendations(@PathVariable Long studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        // Check if student can still select
        if (!selectionService.canStudentSelect(studentId)) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Selection deadline has passed or you already have a confirmed faculty"
            ));
        }

        // Fetch all faculty
        List<Faculty> allFaculty = facultyRepository.findAvailableFaculty();

        // Prepare payload for ML recommender
        List<Map<String, String>> facultyPayload = allFaculty.stream()
            .map(fac -> {
                Map<String, String> map = new HashMap<>();
                map.put("name", fac.getName());
                map.put("email", fac.getEmail());
                map.put("domainExpertise", fac.getDomainExpertise());
                return map;
            }).toList();

        if (facultyPayload.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "message", "No faculty available at the moment"
            ));
        }

        String combinedText = student.getProjectTitle() + " " + student.getProjectIdea();

        Map<String, Object> requestPayload = new HashMap<>();
        requestPayload.put("student_project", combinedText);
        requestPayload.put("faculty", facultyPayload);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestPayload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "http://localhost:5001/recommend-faculty", 
                    httpEntity, 
                    String.class
            );

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✨ NEW: Student selects a faculty from recommendations
     */
    @PostMapping("/{studentId}/select-faculty/{facultyId}")
    public ResponseEntity<?> selectFaculty(
            @PathVariable Long studentId, 
            @PathVariable Long facultyId) {
        
        try {
            String message = selectionService.requestFaculty(studentId, facultyId);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✨ NEW: Get student's current status
     */
    @GetMapping("/{studentId}/status")
    public ResponseEntity<?> getStudentStatus(@PathVariable Long studentId) {
        try {
            String status = selectionService.getStudentStatus(studentId);
            Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", status);
            response.put("selectionStatus", student.getSelectionStatus());
            response.put("canSelect", selectionService.canStudentSelect(studentId));
            
            if (student.getRequestedFaculty() != null) {
                response.put("requestedFaculty", Map.of(
                    "id", student.getRequestedFaculty().getId(),
                    "name", student.getRequestedFaculty().getName()
                ));
            }
            
            if (student.getAssignedFaculty() != null) {
                response.put("assignedFaculty", Map.of(
                    "id", student.getAssignedFaculty().getId(),
                    "name", student.getAssignedFaculty().getName()
                ));
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
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

    @GetMapping("/email/{email}")
    public Student getStudentByEmail(@PathVariable String email) {
        return studentRepository.findByEmail(email);
    }
}