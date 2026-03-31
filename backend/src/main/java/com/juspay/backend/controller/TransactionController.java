package com.juspay.backend.controller;

import com.juspay.backend.domain.Transaction;
import com.juspay.backend.domain.Wallet;
import com.juspay.backend.dto.TransactionRequest;
import com.juspay.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/send")
    public ResponseEntity<Transaction> sendMoney(Authentication authentication, @Valid @RequestBody TransactionRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(transactionService.initiateTransfer(email, request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Transaction>> getHistory(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(transactionService.getMyTransactions(email));
    }

    @GetMapping("/wallet")
    public ResponseEntity<Wallet> getWallet(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(transactionService.getMyWallet(email));
    }
}
