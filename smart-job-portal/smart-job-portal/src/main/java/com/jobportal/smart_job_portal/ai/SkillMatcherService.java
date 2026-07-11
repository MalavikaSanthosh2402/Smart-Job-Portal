package com.jobportal.smart_job_portal.ai;

import com.jobportal.smart_job_portal.dto.MatchResultDTO;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Set;

@Service
public class SkillMatcherService {

    public MatchResultDTO match(Set<String> resumeSkills,
                                Set<String> requiredSkills) {

        // Normalize both skill sets
        Set<String> normalizedResume    = normalize(resumeSkills);
        Set<String> normalizedRequired  = normalize(requiredSkills);

        // Find matched skills — OOP: Set intersection
        Set<String> matched = new HashSet<>(normalizedResume);
        matched.retainAll(normalizedRequired);

        // Find missing skills — Skill Gap
        Set<String> missing = new HashSet<>(normalizedRequired);
        missing.removeAll(normalizedResume);

        // Calculate percentage score
        long score = 0;
        if (!normalizedRequired.isEmpty()) {
            score = Math.round(
                    ((double) matched.size() / normalizedRequired.size()) * 100
            );
        }

        return new MatchResultDTO(score, matched, missing);
    }

    private Set<String> normalize(Set<String> skills) {
        Set<String> result = new HashSet<>();
        for (String skill : skills) {
            if (skill != null) {
                String normalized = skill.toLowerCase()
                        .trim()
                        .replace(".js", "")
                        .replace(" ", "");
                result.add(normalized);
            }
        }
        return result;
    }
}