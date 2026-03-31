package com.juspay.backend.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;

@Document(collection = "wallets")
public class Wallet {
    @Id
    private String id;
    private String userId;
    private BigDecimal balance;

    public Wallet() {}

    public Wallet(String userId, BigDecimal balance) {
        this.userId = userId;
        this.balance = balance;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
