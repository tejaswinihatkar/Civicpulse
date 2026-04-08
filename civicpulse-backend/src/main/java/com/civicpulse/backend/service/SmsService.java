package com.civicpulse.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsService {

    @Async
    public void sendSms(String phoneNumber, String message) {
        // In a real scenario, you would use Twilio or a similar provider here.
        // For now, we simulate the 'SMS Sent' event in the logs.
        log.info("📢 SMS SENT to {}: {}", phoneNumber, message);
        
        // Example Twilio integration structure:
        // Message.creator(new PhoneNumber(phoneNumber), new PhoneNumber(from), message).create();
    }
}
