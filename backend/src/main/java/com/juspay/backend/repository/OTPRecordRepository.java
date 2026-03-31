package com.juspay.backend.repository;

import com.juspay.backend.domain.OTPRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface OTPRecordRepository extends MongoRepository<OTPRecord, String> {
    Optional<OTPRecord> findByEmail(String email);
    void deleteByEmail(String email);
}
