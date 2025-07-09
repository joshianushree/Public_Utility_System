package com.utility.requestmanager.service;

import com.utility.requestmanager.model.Login;

public interface LoginService {
    Login authenticateUser(String username, String password);
}
