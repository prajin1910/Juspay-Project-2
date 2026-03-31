package com.juspay.backend.repository;

import com.juspay.backend.domain.Wallet;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface WalletRepository extends MongoRepository<Wallet, String> {
    Optional<Wallet> findByUserId(String userId);
}
