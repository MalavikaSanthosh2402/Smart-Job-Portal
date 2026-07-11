package com.jobportal.smart_job_portal.repository;

import com.jobportal.smart_job_portal.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobSeekerId(Long jobSeekerId);
    List<Application> findByJobListingId(Long jobListingId);
    Optional<Application> findByJobSeekerIdAndJobListingId(
            Long jobSeekerId, Long jobListingId);
}