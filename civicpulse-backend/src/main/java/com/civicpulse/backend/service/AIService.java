package com.civicpulse.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class AIService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateChatResponse(String userMessage) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            log.warn("Gemini API key is missing. Using mock AI response.");
            return "I am the CivicPulse AI Assistant! (Note: Gemini API Key is missing. Add gemini.api.key in application.properties to enable real AI).";
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

            String systemInstruction = "You are the CivicPulse AI Assistant. It is a civic management platform. You guide Citizens to report issues, Field Workers to resolve them, and NGOs to track impact. Keep answers short and helpful under 3 sentences. " +
                "Here is the website navigation map for users: " +
                "Landing Page: /, Login: /login, Register: /register, Forgot Password: /forgot-password. " +
                "Citizen panel: Dashboard: /citizen, Report Issue: /citizen/report, Rewards: /citizen/rewards, Issue Details: /citizen/issue-details, Reels: /citizen/reels, Profile: /citizen/profile. " +
                "Authority panel: Dashboard & Analytics: /authority, /authority/analytics, Complaints: /authority/complaints, Workers Mgt: /authority/workers, Profile: /authority/profile. " +
                "Worker panel: Dashboard: /worker, Calendar: /worker/calendar, Performance: /worker/performance, Profile: /worker/profile. " +
                "NGO panel: Dashboard: /ngo, Projects: /ngo/projects, Impact: /ngo/impact, Profile: /ngo/profile. " +
                "If a user asks how to navigate somewhere, provide the exact path.";
            
            Map<String, Object> requestBody = Map.of(
                "system_instruction", Map.of(
                    "parts", List.of(Map.of("text", systemInstruction))
                ),
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", userMessage)
                    ))
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            Map response = restTemplate.postForObject(url, request, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                return (String) parts.get(0).get("text");
            }
            return "Sorry, I couldn't understand that.";
        } catch (Exception e) {
            log.error("Error communicating with Gemini AI: ", e);
            return "An error occurred while reaching the AI brain.";
        }
    }

    public Map<String, String> routeComplaint(String title, String description) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            return Map.of("category", "GENERAL", "severity", "LOW");
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

            String systemInstruction = "Classify the complaint. Output exactly JSON format like: {\"category\": \"WATER\", \"severity\": \"HIGH\"}. Allowed categories: WATER, ROADS, ELECTRICITY, SANITATION, GENERAL. Allowed severities: HIGH, MEDIUM, LOW.";
            
            Map<String, Object> requestBody = Map.of(
                "system_instruction", Map.of("parts", List.of(Map.of("text", systemInstruction))),
                "contents", List.of(Map.of("parts", List.of(Map.of("text", "Title: " + title + "\nDesc: " + description)))),
                "generationConfig", Map.of("response_mime_type", "application/json")
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            Map response = restTemplate.postForObject(url, request, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                String jsonStr = (String) parts.get(0).get("text");

                // Parse the JSON string 
                // Assuming format exactly {"category": "X", "severity": "Y"}
                String cat = jsonStr.contains("\"category\": \"") ? jsonStr.split("\"category\": \"")[1].split("\"")[0] : "GENERAL";
                String sev = jsonStr.contains("\"severity\": \"") ? jsonStr.split("\"severity\": \"")[1].split("\"")[0] : "LOW";
                return Map.of("category", cat, "severity", sev);
            }
        } catch (Exception e) {
            log.error("AI Routing failed: ", e);
        }
        return Map.of("category", "GENERAL", "severity", "LOW");
    }
}
