package com.juspay.backend.controller;

import com.juspay.backend.domain.User;
import com.juspay.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allow frontend access
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> (u.getName() != null && u.getName().toLowerCase().contains(query.toLowerCase())) ||
                             (u.getPhone() != null && u.getPhone().contains(query)) ||
                             (u.getUpiId() != null && u.getUpiId().toLowerCase().contains(query.toLowerCase())))
                .map(u -> {
                    u.setPassword(null);
                    return u;
                })
                .toList();
        return ResponseEntity.ok(users);
    }
}
