package com.juspay.backend.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "otp_records")
public class OTPRecord {
    @Id
    private String id;
    private String email;
    private String hashedOtp;
    private LocalDateTime expirationTime;

    public OTPRecord() {}

    public OTPRecord(String email, String hashedOtp, LocalDateTime expirationTime) {
        this.email = email;
        this.hashedOtp = hashedOtp;
        this.expirationTime = expirationTime;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getHashedOtp() { return hashedOtp; }
    public void setHashedOtp(String hashedOtp) { this.hashedOtp = hashedOtp; }
    public LocalDateTime getExpirationTime() { return expirationTime; }
    public void setExpirationTime(LocalDateTime expirationTime) { this.expirationTime = expirationTime; }
}
