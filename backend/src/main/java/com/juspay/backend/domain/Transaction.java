package com.juspay.backend.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "transactions")
public class Transaction {
    @Id
    private String id;
    private String sourceWalletId; // "EXTERNAL" if admin adds funds
    private String destinationWalletId;
    private BigDecimal amount;
    private LocalDateTime timestamp;
    private TransactionStatus status;

    public enum TransactionStatus {
        PENDING, COMPLETED, FAILED
    }

    public Transaction() {}

    public Transaction(String sourceWalletId, String destinationWalletId, BigDecimal amount, LocalDateTime timestamp, TransactionStatus status) {
        this.sourceWalletId = sourceWalletId;
        this.destinationWalletId = destinationWalletId;
        this.amount = amount;
        this.timestamp = timestamp;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSourceWalletId() { return sourceWalletId; }
    public void setSourceWalletId(String sourceWalletId) { this.sourceWalletId = sourceWalletId; }
    public String getDestinationWalletId() { return destinationWalletId; }
    public void setDestinationWalletId(String destinationWalletId) { this.destinationWalletId = destinationWalletId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }
}
