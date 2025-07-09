package com.utility.requestmanager.controller;

import com.utility.requestmanager.model.Login;
import com.utility.requestmanager.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")  // Adjust frontend URL as needed
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public Login login(@RequestBody Login loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        return loginService.authenticateUser(username, password);
    }
}
