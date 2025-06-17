package com.example.server_ai_gif.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.List;
import java.util.Map;

@Service
public class PromptMatchingService {

    public List<Map<String, Object>> findMatchingSegments(String prompt, List<Map<String, Object>> transcript) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String transcriptJson = mapper.writeValueAsString(transcript);

        ProcessBuilder processBuilder = new ProcessBuilder("python3", "scripts/match_prompt.py", prompt);

        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // Write transcript JSON to the Python script's stdin
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
            writer.write(transcriptJson);
            writer.flush();
        }

        // Read Python script output
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            return mapper.readValue(output.toString(), new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse matched segments", e);
        }
    }
}
