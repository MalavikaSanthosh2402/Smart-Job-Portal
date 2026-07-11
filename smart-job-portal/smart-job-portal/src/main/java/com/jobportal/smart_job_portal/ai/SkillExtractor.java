package com.jobportal.smart_job_portal.ai;

import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Set;

@Component
public class SkillExtractor {

    private static final Set<String> SKILL_DICTIONARY = Set.of(
            "java", "spring", "springboot", "python", "javascript",
            "react", "nodejs", "mysql", "postgresql", "mongodb",
            "docker", "kubernetes", "git", "aws", "html", "css",
            "restapi", "maven", "junit", "microservices",
            "agile", "scrum", "typescript", "angular", "vue", "redux",
            "jenkins", "linux", "sql", "nosql", "redis", "kafka",
            "jpa", "bootstrap", "tailwind", "figma",
            "android", "ios", "flutter", "kotlin", "swift", "php",
            "laravel", "django", "flask", "dotnet", "csharp", "azure",
            "gcp", "terraform", "ansible", "graphql", "selenium"
    );

    public Set<String> extractFromText(String text) {
        Set<String> found = new HashSet<>();
        if (text == null || text.isEmpty()) return found;

        String[] words = text.toLowerCase()
                .split("[\\s,./;:()\\[\\]{}+\\-*&^%$#@!~`|<>?]+");

        for (String word : words) {
            String cleaned = word.replace(".js", "")
                    .replace("-", "")
                    .trim();
            if (SKILL_DICTIONARY.contains(cleaned)) {
                found.add(cleaned);
            }
        }
        return found;
    }
}