package com.jobportal.smart_job_portal.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "job_seekers")
public class JobSeeker extends User {

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "resume_text", columnDefinition = "TEXT")
    private String resumeText;

    @Column(name = "profile_summary", columnDefinition = "TEXT")
    private String profileSummary;

    @Column(name = "experience_years")
    private int experienceYears;

    @ElementCollection
    @CollectionTable(
            name = "job_seeker_skills",
            joinColumns = @JoinColumn(name = "job_seeker_id")
    )
    @Column(name = "skill")
    private Set<String> skills = new HashSet<>();
}