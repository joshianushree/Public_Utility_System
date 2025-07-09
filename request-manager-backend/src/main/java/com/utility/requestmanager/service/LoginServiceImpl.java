package com.utility.requestmanager.service;

import com.utility.requestmanager.model.Login;
import com.utility.requestmanager.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private LoginRepository loginRepository;

    @Override
    public Login authenticateUser(String username, String password) {
        Optional<Login> userOptional = loginRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            Login user = userOptional.get();
            if (user.getPassword().equals(password)) {
                return user;
            } else {
                throw new RuntimeException("Invalid password");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
