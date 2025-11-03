package com.taskbox.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String userId;
    private String name;
    private String role; // STUDENT or TEACHER
    private String message;
    
    public AuthResponse(String token, String userId, String name, String role) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.role = role;
        this.message = "Login successful";
    }
}

