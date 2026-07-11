package com.jobportal.smart_job_portal.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String role; // "JOB_SEEKER" or "EMPLOYER"
    private String companyName; // only for EMPLOYER
    private String phoneNumber;
}