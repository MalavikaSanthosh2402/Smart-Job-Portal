package com.jobportal.smart_job_portal.controller;

import com.jobportal.smart_job_portal.dto.MatchResultDTO;
import com.jobportal.smart_job_portal.model.Application;
import com.jobportal.smart_job_portal.repository.ApplicationRepository;
import com.jobportal.smart_job_portal.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @PostMapping("/apply/{jobSeekerId}/{jobId}")
    public ResponseEntity<Application> applyForJob(
            @PathVariable Long jobSeekerId,
            @PathVariable Long jobId,
            @RequestParam(required = false) String coverLetter) {
        Application application = applicationService
                .applyForJob(jobSeekerId, jobId, coverLetter);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/match/{applicationId}")
    public ResponseEntity<MatchResultDTO> getMatchScore(
            @PathVariable Long applicationId) {
        MatchResultDTO result = applicationService
                .getMatchScore(applicationId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/jobseeker/{jobSeekerId}")
    public ResponseEntity<List<Application>> getByJobSeeker(
            @PathVariable Long jobSeekerId) {
        List<Application> applications = applicationService
                .getApplicationsByJobSeeker(jobSeekerId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getByJob(
            @PathVariable Long jobId) {
        List<Application> applications = applicationService
                .getApplicationsByJob(jobId);
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/update/{applicationId}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam String status) {
        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException("Application not found!"));
        application.setStatus(status);
        applicationRepository.save(application);
        return ResponseEntity.ok(application);
    }
}