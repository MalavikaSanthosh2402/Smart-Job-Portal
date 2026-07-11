package com.jobportal.smart_job_portal.service;

import com.jobportal.smart_job_portal.dto.AuthResponse;
import com.jobportal.smart_job_portal.dto.LoginRequest;
import com.jobportal.smart_job_portal.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}