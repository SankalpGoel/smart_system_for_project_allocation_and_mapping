package com.smartportal.projectAllocation.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartportal.projectAllocation.model.Faculty;
import com.smartportal.projectAllocation.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping
    public Faculty registerFaculty(@RequestBody Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    @GetMapping
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    @GetMapping("/{email}")
    public Faculty getFacultyByEmail(@PathVariable String email) {
        return facultyRepository.findByEmail(email);
    }

    @PostMapping("/scrape")
    public ResponseEntity<Faculty> scrapeWithExternalData(@RequestBody Faculty faculty) {
        String url = "http://localhost:5000/scrape-faculty";

        Map<String, Object> payload = new HashMap<>();
        payload.put("orcid", faculty.getOrcid());
        payload.put("scopus", faculty.getScopus());
        payload.put("faculty", faculty);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response.getBody());

            String keywords = root.get("keywords").asText();
            
            if (keywords != null && !keywords.isEmpty()) {
                faculty.setDomainExpertise(keywords);
            }

            Faculty saved = facultyRepository.save(faculty);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
