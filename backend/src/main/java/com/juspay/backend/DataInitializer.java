package com.juspay.backend;

import com.juspay.backend.domain.Role;
import com.juspay.backend.domain.User;
import com.juspay.backend.domain.Wallet;
import com.juspay.backend.repository.UserRepository;
import com.juspay.backend.repository.WalletRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, WalletRepository walletRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@example.com");
            admin.setPhone("0000000000");
            admin.setPassword(passwordEncoder.encode("admin@2004"));
            admin.setRoles(Collections.singleton(Role.ADMIN));
            admin.setUpiId("admin@juspay");
            admin.setWalletId("admin-wallet");
            admin = userRepository.save(admin);
            
            Wallet wallet = new Wallet(admin.getId(), BigDecimal.ZERO);
            walletRepository.save(wallet);
            
            System.out.println("Default Admin created: admin@example.com / admin@2004");
        }
    }
}
