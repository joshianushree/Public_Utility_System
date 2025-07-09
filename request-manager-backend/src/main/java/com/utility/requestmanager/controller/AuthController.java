package com.utility.requestmanager.controller;

import com.utility.requestmanager.model.Role;
import com.utility.requestmanager.model.User;
import com.utility.requestmanager.repository.UserRepository;
import com.utility.requestmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    // 🔐 Register New User
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            }

            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            user.setRole(Role.USER); // Default role
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);

            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    // ✅ Updated Login Endpoint for HTTP Basic Auth
    @GetMapping("/login")
    public ResponseEntity<String> login(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = principal.getName();
        System.out.println("🔐 Logged-in user (from Principal): " + username);

        User user = userService.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        System.out.println("✅ Login successful: " + user.getUsername() + ", Role: " + user.getRole().name());
        return ResponseEntity.ok(user.getRole().name()); // "ADMIN" or "USER"
    }
}
