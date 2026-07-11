package com.jobportal.smart_job_portal.service;

import com.jobportal.smart_job_portal.ai.SkillMatcherService;
import com.jobportal.smart_job_portal.dto.MatchResultDTO;
import com.jobportal.smart_job_portal.model.Application;
import com.jobportal.smart_job_portal.model.JobListing;
import com.jobportal.smart_job_portal.model.JobSeeker;
import com.jobportal.smart_job_portal.repository.ApplicationRepository;
import com.jobportal.smart_job_portal.repository.JobListingRepository;
import com.jobportal.smart_job_portal.repository.JobSeekerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobSeekerRepository jobSeekerRepository;

    @Autowired
    private JobListingRepository jobListingRepository;

    @Autowired
    private SkillMatcherService skillMatcherService;

    @Override
    public Application applyForJob(Long jobSeekerId, Long jobId,
                                   String coverLetter) {

        // Check if already applied
        Optional<Application> existing = applicationRepository
                .findByJobSeekerIdAndJobListingId(jobSeekerId, jobId);
        if (existing.isPresent()) {
            throw new RuntimeException(
                    "You have already applied for this job!");
        }

        JobSeeker jobSeeker = jobSeekerRepository
                .findById(jobSeekerId)
                .orElseThrow(() ->
                        new RuntimeException("Job Seeker not found!"));

        JobListing jobListing = jobListingRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found!"));

        // Run AI matching
        MatchResultDTO matchResult = skillMatcherService.match(
                jobSeeker.getSkills(),
                jobListing.getRequiredSkills()
        );

        // Create application with match results
        Application application = new Application();
        application.setJobSeeker(jobSeeker);
        application.setJobListing(jobListing);
        application.setCoverLetter(coverLetter);
        application.setMatchScore(matchResult.getScore());
        application.setMatchedSkills(matchResult.getMatchedSkills());
        application.setMissingSkills(matchResult.getMissingSkills());
        application.setStatus("PENDING");

        return applicationRepository.save(application);
    }

    @Override
    public MatchResultDTO getMatchScore(Long applicationId) {
        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException("Application not found!"));

        return new MatchResultDTO(
                (long) application.getMatchScore(),
                application.getMatchedSkills(),
                application.getMissingSkills()
        );
    }

    @Override
    public List<Application> getApplicationsByJobSeeker(
            Long jobSeekerId) {
        return applicationRepository
                .findByJobSeekerId(jobSeekerId);
    }

    @Override
    public List<Application> getApplicationsByJob(Long jobId) {
        return applicationRepository
                .findByJobListingId(jobId);
    }
}