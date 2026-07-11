package com.jobportal.smart_job_portal.factory;

import com.jobportal.smart_job_portal.model.Employer;
import com.jobportal.smart_job_portal.model.JobSeeker;
import com.jobportal.smart_job_portal.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserFactory {

    public User createUser(String role) {
        switch (role.toUpperCase()) {
            case "JOB_SEEKER":
                return new JobSeeker();
            case "EMPLOYER":
                return new Employer();
            default:
                throw new IllegalArgumentException(
                        "Invalid role: " + role
                );
        }
    }
}