package com.juspay.backend.repository;

import com.juspay.backend.domain.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findBySourceWalletIdOrDestinationWalletIdOrderByTimestampDesc(String source, String dest);
}
