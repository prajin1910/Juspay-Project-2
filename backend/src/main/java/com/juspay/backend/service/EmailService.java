package com.juspay.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendOtpEmail(String to, String otp) {
        logger.info("=== OTP for {} is: {} ===", to, otp);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your Payment Platform OTP");
            message.setText("Your OTP is: " + otp + "\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.");
            javaMailSender.send(message);
            logger.info("OTP email sent successfully to {}", to);
        } catch (Exception e) {
            logger.warn("Could not send OTP email to {}. OTP is logged above for development use. Error: {}", to, e.getMessage());
        }
    }
}
