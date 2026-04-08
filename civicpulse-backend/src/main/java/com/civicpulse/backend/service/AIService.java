package com.civicpulse.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
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
            String url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

            String systemInstruction = "🚀 PERSONALITY: You are the CivicPulse 'Smart Concierge'. You are friendly, professional, and slightly obsessed with making the city better.\n" +
                "🌍 LANGUAGE: You are fully multilingual. If a user asks in Hindi, reply in Hindi. Use Marathi for Marathi, etc. Keep the soul of the language.\n" +
                "🗺️ SITEMAP & PROACTIVE NAVIGATION:\n" +
                "- CITIZENS: Direct them to '/citizen/report' to fix the city, and '/citizen/rewards' to see their points. Mention they get 10 points per report!\n" +
                "- AUTHORITIES: Direct them to '/authority' (Command Center) for quick actions or '/authority/analytics' for city trends.\n" +
                "- WORKERS: Remind them to check '/worker/calendar' for today's schedule.\n" +
                "- NGOs: Suggest '/ngo/projects' to sponsor a local cleanup.\n" +
                "💬 STYLE: Use 1-2 emojis per message. Keep answers informative but concise (under 4 sentences). Always end with a helpful nudge like 'Is there anything else I can guide you to?'";
            
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", "INSTRUCTION: " + systemInstruction + "\n\nUSER QUERY: " + userMessage))
                    )
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            Map response = restTemplate.postForObject(url, request, Map.class);
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    if (candidate.containsKey("content")) {
                        Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        return (String) parts.get(0).get("text");
                    }
                }
            }
            return "I'm sorry, I'm having trouble processing your request right now.";
        } catch (HttpStatusCodeException e) {
            log.error("AI API Error ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            return "AI brain error (" + e.getStatusCode() + "). Please check API key/quota.";
        } catch (Exception e) {
            log.error("Unexpected AI Error: ", e);
            return "Connection error. Please check your internet or API settings.";
        }
    }

    public Map<String, String> routeComplaint(String title, String description) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            return Map.of("category", "OTHER", "severity", "MEDIUM");
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

            String systemInstruction = "Classify the civic complaint. Output exactly JSON format: {\"category\": \"WATER\", \"severity\": \"HIGH\"}. " +
                "Allowed categories: ROAD, GARBAGE, ELECTRICITY, WATER, DRAINAGE, STREETLIGHT, PARK, TRAFFIC, OTHER. " +
                "Allowed severities: CRITICAL, HIGH, MEDIUM, LOW.";
            
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", "INSTRUCTION: " + systemInstruction + "\n\nDATA: Title: " + title + "\nDesc: " + description))
                    )
                ),
                "generationConfig", Map.of("response_mime_type", "application/json")
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            Map response = restTemplate.postForObject(url, request, Map.class);
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    if (candidate.containsKey("content")) {
                        Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        String jsonStr = (String) parts.get(0).get("text");

                        // Extract value from JSON manually for robustness
                        String cat = jsonStr.contains("\"category\":") ? jsonStr.split("\"category\":")[1].split("\"")[1] : "OTHER";
                        String sev = jsonStr.contains("\"severity\":") ? jsonStr.split("\"severity\":")[1].split("\"")[1] : "MEDIUM";
                        return Map.of("category", cat, "severity", sev);
                    }
                }
            }
        } catch (Exception e) {
            log.error("AI Routing failed: ", e);
        }
        return Map.of("category", "OTHER", "severity", "MEDIUM");
    }
}
