package com.utility.requestmanager;

import com.utility.requestmanager.model.Role;
import com.utility.requestmanager.model.User;
import com.utility.requestmanager.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class RequestmanagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(RequestmanagerApplication.class, args);
	}

	@Bean
	public CommandLineRunner createDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByUsername("admin")) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setPassword(passwordEncoder.encode("admin123")); // Default password
				admin.setRole(Role.ADMIN); // Make sure Role.ADMIN exists in your enum
				userRepository.save(admin);
				System.out.println("✅ Default admin user created: username='admin', password='admin123'");
			} else {
				System.out.println("ℹ️ Admin user already exists.");
			}
		};
	}
}
