package com.civicpulse.backend.controller;

import com.civicpulse.backend.dto.AIChatRequest;
import com.civicpulse.backend.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class ChatController {

    private final AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody AIChatRequest request) {
        String responseText = aiService.generateChatResponse(request.getMessage());
        return ResponseEntity.ok(Map.of("response", responseText));
    }
}
