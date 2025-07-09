package com.utility.requestmanager.controller;

import com.utility.requestmanager.model.ServiceRequest;
import com.utility.requestmanager.model.Status;
import com.utility.requestmanager.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:3000")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService service;

    // ✅ Submit a new request
    @PostMapping
    public ResponseEntity<ServiceRequest> createRequest(@Valid @RequestBody ServiceRequest request,
                                                        Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        request.setCreatedBy(principal.getName());
        ServiceRequest savedRequest = service.createRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);
    }

    // ✅ Get all requests (admin)
    @GetMapping
    public List<ServiceRequest> getAllRequests() {
        return service.getAllRequests();
    }

    // ✅ Get requests submitted by logged-in user
    @GetMapping("/user")
    public ResponseEntity<List<ServiceRequest>> getRequestsByLoggedInUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = principal.getName();
        List<ServiceRequest> requests = service.getRequestsByCreatedBy(username);
        return ResponseEntity.ok(requests);
    }

    // ✅ Update status (admin only)
    @PutMapping("/{id}/status")
    public ResponseEntity<ServiceRequest> updateRequestStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Status newStatus = Status.valueOf(status.toUpperCase());
            ServiceRequest updated = service.updateStatus(id, newStatus);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ✅ Delete request by logged-in user
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserRequest(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        Optional<ServiceRequest> optional = service.getRequestById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found");
        }

        ServiceRequest request = optional.get();
        String username = principal.getName();

        if (!request.getCreatedBy().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to delete this request");
        }

        service.deleteRequest(id);
        return ResponseEntity.ok("Request deleted successfully");
    }
}
