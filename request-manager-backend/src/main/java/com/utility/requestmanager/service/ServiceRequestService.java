package com.utility.requestmanager.service;

import com.utility.requestmanager.model.ServiceRequest;
import com.utility.requestmanager.model.Status;
import com.utility.requestmanager.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    // ✅ Create request
    public ServiceRequest createRequest(ServiceRequest request) {
        request.setUpdatedAt(null); // set on creation
        return serviceRequestRepository.save(request);
    }

    // ✅ Get all requests (for admin)
    public List<ServiceRequest> getAllRequests() {
        return serviceRequestRepository.findAll();
    }

    // ✅ Get requests by username
    public List<ServiceRequest> getRequestsByCreatedBy(String username) {
        return serviceRequestRepository.findByCreatedBy(username);
    }

    // ✅ Update status of a request
    public ServiceRequest updateStatus(Long id, Status newStatus) {
        Optional<ServiceRequest> optionalRequest = serviceRequestRepository.findById(id);
        if (optionalRequest.isPresent()) {
            ServiceRequest request = optionalRequest.get();
            request.setStatus(newStatus);
            request.setUpdatedAt(LocalDateTime.now()); // ✅ manually update timestamp
            return serviceRequestRepository.save(request);
        } else {
            return null;
        }
    }

    // ✅ Get request by ID
    public Optional<ServiceRequest> getRequestById(Long id) {
        return serviceRequestRepository.findById(id);
    }

    // ✅ Delete request
    public void deleteRequest(Long id) {
        serviceRequestRepository.deleteById(id);
    }
}
