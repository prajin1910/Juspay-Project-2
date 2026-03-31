package com.juspay.backend.dto;

public class VerifyOtpRequest {
    private String email;
    private String otp;
    private RegisterRequest registerDetails; // Pass the original details to create user

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public RegisterRequest getRegisterDetails() { return registerDetails; }
    public void setRegisterDetails(RegisterRequest registerDetails) { this.registerDetails = registerDetails; }
}
