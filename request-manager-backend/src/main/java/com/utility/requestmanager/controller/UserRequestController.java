package com.utility.requestmanager.controller;

import com.utility.requestmanager.model.ServiceRequest;
import com.utility.requestmanager.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserRequestController {

    @Autowired
    private ServiceRequestService service;

    // ✅ Get all requests created by the logged-in user
    @GetMapping("/requests")
    public ResponseEntity<List<ServiceRequest>> getRequestsByLoggedInUser(Principal principal) {
        String username = principal.getName();
        List<ServiceRequest> requests = service.getRequestsByCreatedBy(username);
        return ResponseEntity.ok(requests);
    }
}
