package com.juspay.backend.service;

import com.juspay.backend.domain.Transaction;
import com.juspay.backend.domain.User;
import com.juspay.backend.domain.Wallet;
import com.juspay.backend.dto.TransactionRequest;
import com.juspay.backend.repository.TransactionRepository;
import com.juspay.backend.repository.UserRepository;
import com.juspay.backend.repository.WalletRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository,
                              WalletRepository walletRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    public Transaction initiateTransfer(String sourceEmail, TransactionRequest request) {
        User sourceUser = userRepository.findByEmail(sourceEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User destUser = userRepository.findByUpiId(request.getDestinationUpiId())
                .orElseThrow(() -> new RuntimeException("Receiver not found by UPI ID"));

        if (sourceUser.getId().equals(destUser.getId())) {
            throw new RuntimeException("Cannot send money to yourself");
        }

        Wallet sourceWallet = walletRepository.findByUserId(sourceUser.getId())
                .orElseThrow(() -> new RuntimeException("Source wallet not found"));

        if (sourceWallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        Wallet destWallet = walletRepository.findByUserId(destUser.getId())
                .orElseThrow(() -> new RuntimeException("Destination wallet not found"));

        Transaction transaction = new Transaction(
                sourceWallet.getId(), destWallet.getId(), request.getAmount(),
                LocalDateTime.now(), Transaction.TransactionStatus.PENDING
        );
        transaction = transactionRepository.save(transaction);

        try {
            sourceWallet.setBalance(sourceWallet.getBalance().subtract(request.getAmount()));
            walletRepository.save(sourceWallet);

            destWallet.setBalance(destWallet.getBalance().add(request.getAmount()));
            walletRepository.save(destWallet);

            transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        } catch (Exception e) {
            transaction.setStatus(Transaction.TransactionStatus.FAILED);
        }

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getMyTransactions(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Wallet wallet = walletRepository.findByUserId(user.getId()).orElseThrow();
        return transactionRepository.findBySourceWalletIdOrDestinationWalletIdOrderByTimestampDesc(wallet.getId(), wallet.getId());
    }

    public Wallet getMyWallet(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return walletRepository.findByUserId(user.getId()).orElseThrow();
    }
}
