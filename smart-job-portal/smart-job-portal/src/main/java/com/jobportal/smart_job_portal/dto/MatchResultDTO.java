package com.jobportal.smart_job_portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Set;

@Data
@AllArgsConstructor
public class MatchResultDTO {
    private long score;
    private Set<String> matchedSkills;
    private Set<String> missingSkills;
}