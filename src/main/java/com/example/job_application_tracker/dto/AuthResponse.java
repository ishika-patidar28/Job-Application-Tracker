package com.example.job_application_tracker.dto;

public record AuthResponse(String accessToken, String tokenType, String username, String email) {
    public AuthResponse(String accessToken, String username, String email) {
        this(accessToken, "Bearer", username, email);
    }
}
