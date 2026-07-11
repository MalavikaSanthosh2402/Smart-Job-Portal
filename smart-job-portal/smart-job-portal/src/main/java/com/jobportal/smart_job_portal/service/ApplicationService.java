package com.jobportal.smart_job_portal.service;

import com.jobportal.smart_job_portal.dto.MatchResultDTO;
import com.jobportal.smart_job_portal.model.Application;
import java.util.List;

public interface ApplicationService {
    Application applyForJob(Long jobSeekerId, Long jobId, String coverLetter);
    MatchResultDTO getMatchScore(Long applicationId);
    List<Application> getApplicationsByJobSeeker(Long jobSeekerId);
    List<Application> getApplicationsByJob(Long jobId);
}