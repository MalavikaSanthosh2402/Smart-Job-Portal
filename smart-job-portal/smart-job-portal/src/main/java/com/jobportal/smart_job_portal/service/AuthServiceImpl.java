package com.jobportal.smart_job_portal.service;

import com.jobportal.smart_job_portal.dto.AuthResponse;
import com.jobportal.smart_job_portal.dto.LoginRequest;
import com.jobportal.smart_job_portal.dto.RegisterRequest;
import com.jobportal.smart_job_portal.factory.UserFactory;
import com.jobportal.smart_job_portal.model.Employer;
import com.jobportal.smart_job_portal.model.JobSeeker;
import com.jobportal.smart_job_portal.model.User;
import com.jobportal.smart_job_portal.repository.EmployerRepository;
import com.jobportal.smart_job_portal.repository.JobSeekerRepository;
import com.jobportal.smart_job_portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobSeekerRepository jobSeekerRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserFactory userFactory;

    @Override
    public AuthResponse register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        // Use Factory Pattern to create correct user type
        User user = userFactory.createUser(request.getRole());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().toUpperCase());

        // Save based on role
        if (user instanceof JobSeeker jobSeeker) {
            jobSeeker.setPhoneNumber(request.getPhoneNumber());
            jobSeekerRepository.save(jobSeeker);
        } else if (user instanceof Employer employer) {
            employer.setCompanyName(request.getCompanyName());
            employer.setPhoneNumber(request.getPhoneNumber());
            employerRepository.save(employer);
        }

        return new AuthResponse(
                "registered-successfully",
                user.getRole(),
                user.getFullName(),
                user.getId()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        return new AuthResponse(
                "login-successful",
                user.getRole(),
                user.getFullName(),
                user.getId()
        );
    }
}