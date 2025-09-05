package com.smartportal.projectAllocation.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartportal.projectAllocation.model.Faculty;
import com.smartportal.projectAllocation.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.InputStream;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@Service
public class FacultyDataService {
    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private RestTemplate restTemplate;

    public void saveFacultyDataFromJson() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("faculty_data.json");
            List<Faculty> facultyList = mapper.readValue(inputStream,
                    new TypeReference<List<Faculty>>() {});

            for (Faculty faculty : facultyList) {
                facultyRepository.save(faculty); // Save basic info first

                //  Call scraper API
                String url = "http://localhost:5000/scrape-faculty";
                Map<String, Object> payload = new HashMap<>();
                payload.put("orcid", faculty.getOrcid());
                payload.put("scopus", faculty.getScopus());

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

                try {
                    ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
                    JsonNode root = mapper.readTree(response.getBody());

                    if (root.has("keywords")) {
                        StringBuilder sb = new StringBuilder();
                        for (JsonNode k : root.get("keywords")) {
                            if (sb.length() > 0) sb.append(", ");
                            sb.append(k.asText());
                        }
                        faculty.setDomainExpertise(sb.toString());
                        facultyRepository.save(faculty);
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


