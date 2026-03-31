package com.juspay.backend.service;

import com.juspay.backend.domain.OTPRecord;
import com.juspay.backend.domain.Role;
import com.juspay.backend.domain.User;
import com.juspay.backend.domain.Wallet;
import com.juspay.backend.dto.AuthResponse;
import com.juspay.backend.dto.LoginRequest;
import com.juspay.backend.dto.RegisterRequest;
import com.juspay.backend.dto.VerifyOtpRequest;
import com.juspay.backend.repository.OTPRecordRepository;
import com.juspay.backend.repository.UserRepository;
import com.juspay.backend.repository.WalletRepository;
import com.juspay.backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OTPRecordRepository otpRecordRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthService(UserRepository userRepository, OTPRecordRepository otpRecordRepository,
                       WalletRepository walletRepository, PasswordEncoder passwordEncoder,
                       EmailService emailService, JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager, UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.otpRecordRepository = otpRecordRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        String hashedOtp = passwordEncoder.encode(otp);
        OTPRecord otpRecord = otpRecordRepository.findByEmail(request.getEmail())
                .orElse(new OTPRecord());
        otpRecord.setEmail(request.getEmail());
        otpRecord.setHashedOtp(hashedOtp);
        otpRecord.setExpirationTime(LocalDateTime.now().plusMinutes(10));
        otpRecordRepository.save(otpRecord);

        emailService.sendOtpEmail(request.getEmail(), otp);
    }

    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        OTPRecord otpRecord = otpRecordRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (otpRecord.getExpirationTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!passwordEncoder.matches(request.getOtp(), otpRecord.getHashedOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        RegisterRequest details = request.getRegisterDetails();
        User user = new User();
        user.setName(details.getName());
        user.setEmail(details.getEmail());
        user.setPhone(details.getPhone());
        user.setPassword(passwordEncoder.encode(details.getPassword()));
        user.setRoles(Collections.singleton(Role.USER));
        
        user.setUpiId(details.getPhone() + "@juspay");
        user.setWalletId(UUID.randomUUID().toString());
        user = userRepository.save(user);

        Wallet wallet = new Wallet(user.getId(), BigDecimal.ZERO);
        walletRepository.save(wallet);

        otpRecordRepository.delete(otpRecord);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getUpiId());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getUpiId());
    }
}
