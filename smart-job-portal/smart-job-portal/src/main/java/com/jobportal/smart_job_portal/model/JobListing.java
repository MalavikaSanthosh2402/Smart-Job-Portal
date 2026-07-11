package com.jobportal.smart_job_portal.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "job_listings")
public class JobListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(name = "salary_range")
    private String salaryRange;

    @Column(name = "job_type")
    private String jobType; // FULL_TIME, PART_TIME, REMOTE

    @Column(name = "experience_required")
    private int experienceRequired;

    @Column(name = "is_active")
    private boolean isActive = true;

    @ElementCollection
    @CollectionTable(
            name = "job_required_skills",
            joinColumns = @JoinColumn(name = "job_id")
    )
    @Column(name = "skill")
    private Set<String> requiredSkills = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}