package com.jobportal.smart_job_portal.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_seeker_id", nullable = false)
    private JobSeeker jobSeeker;

    @ManyToOne
    @JoinColumn(name = "job_listing_id", nullable = false)
    private JobListing jobListing;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "status")
    private String status; // PENDING, REVIEWED, ACCEPTED, REJECTED

    @Column(name = "match_score")
    private double matchScore;

    @ElementCollection
    @CollectionTable(
            name = "application_matched_skills",
            joinColumns = @JoinColumn(name = "application_id")
    )
    @Column(name = "skill")
    private java.util.Set<String> matchedSkills = new java.util.HashSet<>();

    @ElementCollection
    @CollectionTable(
            name = "application_missing_skills",
            joinColumns = @JoinColumn(name = "application_id")
    )
    @Column(name = "skill")
    private java.util.Set<String> missingSkills = new java.util.HashSet<>();

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        status = "PENDING";
    }
}