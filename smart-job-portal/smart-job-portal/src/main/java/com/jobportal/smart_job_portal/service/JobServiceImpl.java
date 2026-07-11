package com.jobportal.smart_job_portal.service;

import com.jobportal.smart_job_portal.dto.JobListingRequest;
import com.jobportal.smart_job_portal.model.Employer;
import com.jobportal.smart_job_portal.model.JobListing;
import com.jobportal.smart_job_portal.repository.EmployerRepository;
import com.jobportal.smart_job_portal.repository.JobListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobListingRepository jobListingRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Override
    public JobListing createJob(JobListingRequest request, Long employerId) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() ->
                        new RuntimeException("Employer not found!"));

        JobListing job = new JobListing();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalaryRange(request.getSalaryRange());
        job.setJobType(request.getJobType());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setEmployer(employer);
        job.setActive(true);

        return jobListingRepository.save(job);
    }

    @Override
    public List<JobListing> getAllActiveJobs() {
        return jobListingRepository.findByIsActiveTrue();
    }

    @Override
    public List<JobListing> getJobsByEmployer(Long employerId) {
        return jobListingRepository.findByEmployerId(employerId);
    }

    @Override
    public JobListing getJobById(Long jobId) {
        return jobListingRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found!"));
    }
}