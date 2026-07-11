package com.jobportal.smart_job_portal.dto;

import lombok.Data;
import java.util.Set;

@Data
public class JobListingRequest {
    private String title;
    private String description;
    private String location;
    private String salaryRange;
    private String jobType;
    private int experienceRequired;
    private Set<String> requiredSkills;
}