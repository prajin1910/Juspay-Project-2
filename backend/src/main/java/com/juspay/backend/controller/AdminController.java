package com.juspay.backend.controller;

import com.juspay.backend.domain.Transaction;
import com.juspay.backend.domain.User;
import com.juspay.backend.domain.Wallet;
import com.juspay.backend.repository.TransactionRepository;
import com.juspay.backend.repository.UserRepository;
import com.juspay.backend.repository.WalletRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public AdminController(UserRepository userRepository, WalletRepository walletRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    @PostMapping("/add-funds/{userId}")
    public ResponseEntity<String> addFunds(@PathVariable String userId, @RequestParam BigDecimal amount) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Wallet wallet = walletRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Wallet not found"));

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        Transaction transaction = new Transaction(
                "EXTERNAL", wallet.getId(), amount, LocalDateTime.now(), Transaction.TransactionStatus.COMPLETED
        );
        transactionRepository.save(transaction);

        return ResponseEntity.ok("Successfully added funds");
    }
}
