package com.juspay.backend.repository;

import com.juspay.backend.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Optional<User> findByUpiId(String upiId);
    List<User> findByNameContainingIgnoreCase(String name);
}
