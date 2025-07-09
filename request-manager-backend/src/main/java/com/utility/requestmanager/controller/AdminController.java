package com.utility.requestmanager.controller;

import com.utility.requestmanager.model.ServiceRequest;
import com.utility.requestmanager.model.Status;
import com.utility.requestmanager.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    // 1. Get all service requests
    @GetMapping("/requests")
    public List<ServiceRequest> getAllRequests() {
        return serviceRequestRepository.findAll();
    }

    // 2. Update status using query param
    @PutMapping("/requests/{id}/status")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {
        return serviceRequestRepository.findById(id)
                .map(existing -> {
                    try {
                        Status newStatus = Status.valueOf(status.toUpperCase());
                        existing.setStatus(newStatus);
                        serviceRequestRepository.save(existing);
                        return ResponseEntity.ok(existing);
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body("Invalid status: " + status);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
