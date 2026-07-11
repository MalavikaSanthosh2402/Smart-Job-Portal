package com.jobportal.smart_job_portal.repository;

import com.jobportal.smart_job_portal.model.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, Long> {
    Optional<Employer> findByEmail(String email);
}