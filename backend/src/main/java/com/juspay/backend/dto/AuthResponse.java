package com.juspay.backend.dto;

public class AuthResponse {
    private String token;
    private String userId;
    private String name;
    private String email;
    private String upiId;

    public AuthResponse(String token, String userId, String name, String email, String upiId) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.upiId = upiId;
    }

    public String getToken() { return token; }
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getUpiId() { return upiId; }
}
