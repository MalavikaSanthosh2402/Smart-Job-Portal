package com.jobportal.smart_job_portal.controller;

import com.jobportal.smart_job_portal.model.JobSeeker;
import com.jobportal.smart_job_portal.repository.JobSeekerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/jobseeker")
@CrossOrigin(origins = "*")
public class JobSeekerController {

    @Autowired
    private JobSeekerRepository jobSeekerRepository;

    @GetMapping("/{id}/profile")
    public ResponseEntity<JobSeeker> getProfile(
            @PathVariable Long id) {
        JobSeeker jobSeeker = jobSeekerRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job Seeker not found!"));
        return ResponseEntity.ok(jobSeeker);
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<JobSeeker> updateProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates) {
        JobSeeker jobSeeker = jobSeekerRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job Seeker not found!"));

        if (updates.containsKey("fullName")) {
            jobSeeker.setFullName(updates.get("fullName"));
        }
        if (updates.containsKey("phoneNumber")) {
            jobSeeker.setPhoneNumber(updates.get("phoneNumber"));
        }
        if (updates.containsKey("profileSummary")) {
            jobSeeker.setProfileSummary(
                    updates.get("profileSummary"));
        }
        if (updates.containsKey("experienceYears")) {
            jobSeeker.setExperienceYears(
                    Integer.parseInt(updates.get("experienceYears")));
        }
        if (updates.containsKey("resumeText")) {
            jobSeeker.setResumeText(updates.get("resumeText"));
        }

        jobSeekerRepository.save(jobSeeker);
        return ResponseEntity.ok(jobSeeker);
    }

    @GetMapping("/{id}/skills")
    public ResponseEntity<Set<String>> getSkills(
            @PathVariable Long id) {
        JobSeeker jobSeeker = jobSeekerRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job Seeker not found!"));
        return ResponseEntity.ok(jobSeeker.getSkills());
    }

    @PostMapping("/{id}/skills")
    public ResponseEntity<Set<String>> addSkill(
            @PathVariable Long id,
            @RequestParam String skill) {
        JobSeeker jobSeeker = jobSeekerRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job Seeker not found!"));
        jobSeeker.getSkills().add(skill.toLowerCase().trim());
        jobSeekerRepository.save(jobSeeker);
        return ResponseEntity.ok(jobSeeker.getSkills());
    }

    @DeleteMapping("/{id}/skills")
    public ResponseEntity<Set<String>> removeSkill(
            @PathVariable Long id,
            @RequestParam String skill) {
        JobSeeker jobSeeker = jobSeekerRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job Seeker not found!"));
        jobSeeker.getSkills().remove(skill);
        jobSeekerRepository.save(jobSeeker);
        return ResponseEntity.ok(jobSeeker.getSkills());
    }
}