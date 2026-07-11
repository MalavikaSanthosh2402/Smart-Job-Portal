package com.jobportal.smart_job_portal.service;

import com.jobportal.smart_job_portal.dto.JobListingRequest;
import com.jobportal.smart_job_portal.model.JobListing;
import java.util.List;

public interface JobService {
    JobListing createJob(JobListingRequest request, Long employerId);
    List<JobListing> getAllActiveJobs();
    List<JobListing> getJobsByEmployer(Long employerId);
    JobListing getJobById(Long jobId);
}