package com.juspay.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class TransactionRequest {
    @NotBlank
    private String destinationUpiId;
    @DecimalMin(value = "1.0", message = "Amount must be greater than 0")
    private BigDecimal amount;

    public String getDestinationUpiId() { return destinationUpiId; }
    public void setDestinationUpiId(String destinationUpiId) { this.destinationUpiId = destinationUpiId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
