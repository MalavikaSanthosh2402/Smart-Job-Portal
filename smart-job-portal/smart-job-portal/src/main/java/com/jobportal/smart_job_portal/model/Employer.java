package com.jobportal.smart_job_portal.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employers")
public class Employer extends User {

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "company_website")
    private String companyWebsite;

    @Column(name = "company_description", columnDefinition = "TEXT")
    private String companyDescription;

    @Column(name = "industry")
    private String industry;

    @Column(name = "company_size")
    private String companySize;

    @Column(name = "phone_number")
    private String phoneNumber;
}