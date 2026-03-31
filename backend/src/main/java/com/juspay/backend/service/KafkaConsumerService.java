package com.juspay.backend.service;

import com.juspay.backend.domain.Transaction;
import com.juspay.backend.domain.Wallet;
import com.juspay.backend.repository.TransactionRepository;
import com.juspay.backend.repository.WalletRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class KafkaConsumerService {

    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;

    public KafkaConsumerService(TransactionRepository transactionRepository, WalletRepository walletRepository) {
        this.transactionRepository = transactionRepository;
        this.walletRepository = walletRepository;
    }

    @KafkaListener(topics = "transactions-topic", groupId = "payment-group")
    @Transactional
    public void consumeTransactionEvent(String transactionId) {
        transactionId = transactionId.replace("\"", "");

        Transaction transaction = transactionRepository.findById(transactionId).orElse(null);
        if (transaction == null || transaction.getStatus() != Transaction.TransactionStatus.PENDING) {
            return;
        }

        try {
            if (!"EXTERNAL".equals(transaction.getSourceWalletId())) {
                Wallet source = walletRepository.findById(transaction.getSourceWalletId())
                        .orElseThrow(() -> new RuntimeException("Source wallet not found"));
                if (source.getBalance().compareTo(transaction.getAmount()) < 0) {
                    throw new RuntimeException("Insufficient balance");
                }
                source.setBalance(source.getBalance().subtract(transaction.getAmount()));
                walletRepository.save(source);
            }

            Wallet dest = walletRepository.findById(transaction.getDestinationWalletId())
                    .orElseThrow(() -> new RuntimeException("Destination wallet not found"));
            dest.setBalance(dest.getBalance().add(transaction.getAmount()));
            walletRepository.save(dest);

            transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        } catch (Exception e) {
            transaction.setStatus(Transaction.TransactionStatus.FAILED);
        } finally {
            transactionRepository.save(transaction);
        }
    }
}
