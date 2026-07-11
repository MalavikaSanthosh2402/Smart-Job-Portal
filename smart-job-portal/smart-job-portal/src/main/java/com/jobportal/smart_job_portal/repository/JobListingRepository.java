package com.jobportal.smart_job_portal.repository;

import com.jobportal.smart_job_portal.model.JobListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobListingRepository extends JpaRepository<JobListing, Long> {
    List<JobListing> findByIsActiveTrue();
    List<JobListing> findByEmployerId(Long employerId);
}