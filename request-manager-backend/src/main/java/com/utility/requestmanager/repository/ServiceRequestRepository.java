package com.utility.requestmanager.repository;

import com.utility.requestmanager.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByCreatedBy(String createdBy);
}
