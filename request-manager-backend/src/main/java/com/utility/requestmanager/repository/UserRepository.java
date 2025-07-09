package com.utility.requestmanager.repository;

import com.utility.requestmanager.model.Role;
import com.utility.requestmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByRole(Role role); // ✅ NOT String
    boolean existsByUsername(String username);
}
