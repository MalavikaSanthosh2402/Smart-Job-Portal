package com.jobportal.smart_job_portal.controller;

import com.jobportal.smart_job_portal.dto.JobListingRequest;
import com.jobportal.smart_job_portal.model.JobListing;
import com.jobportal.smart_job_portal.repository.JobListingRepository;
import com.jobportal.smart_job_portal.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private JobListingRepository jobListingRepository;

    @PostMapping("/create/{employerId}")
    public ResponseEntity<JobListing> createJob(
            @RequestBody JobListingRequest request,
            @PathVariable Long employerId) {
        JobListing job = jobService.createJob(request, employerId);
        return ResponseEntity.ok(job);
    }

    @GetMapping("/all")
    public ResponseEntity<List<JobListing>> getAllJobs() {
        List<JobListing> jobs = jobService.getAllActiveJobs();
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<JobListing>> getJobsByEmployer(
            @PathVariable Long employerId) {
        List<JobListing> jobs = jobService
                .getJobsByEmployer(employerId);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<JobListing>> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType) {
        List<JobListing> jobs = jobService.getAllActiveJobs();

        if (title != null && !title.isEmpty()) {
            jobs = jobs.stream()
                    .filter(job -> job.getTitle().toLowerCase()
                            .contains(title.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
        }
        if (location != null && !location.isEmpty()) {
            jobs = jobs.stream()
                    .filter(job -> job.getLocation().toLowerCase()
                            .contains(location.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
        }
        if (jobType != null && !jobType.isEmpty()) {
            jobs = jobs.stream()
                    .filter(job -> job.getJobType()
                            .equalsIgnoreCase(jobType))
                    .collect(java.util.stream.Collectors.toList());
        }
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobListing> getJobById(
            @PathVariable Long jobId) {
        JobListing job = jobService.getJobById(jobId);
        return ResponseEntity.ok(job);
    }

    @PutMapping("/update/{jobId}")
    public ResponseEntity<JobListing> updateJob(
            @PathVariable Long jobId,
            @RequestBody JobListingRequest request) {
        JobListing job = jobListingRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found!"));
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalaryRange(request.getSalaryRange());
        job.setJobType(request.getJobType());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setRequiredSkills(request.getRequiredSkills());
        jobListingRepository.save(job);
        return ResponseEntity.ok(job);
    }

    @DeleteMapping("/delete/{jobId}")
    public ResponseEntity<String> deleteJob(
            @PathVariable Long jobId) {
        jobListingRepository.deleteById(jobId);
        return ResponseEntity.ok("Job deleted successfully!");
    }
}