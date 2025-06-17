package com.example.server_ai_gif.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;

@Service
public class PythonTranscriptionService {

    public List<Map<String, Object>> runWhisperTranscription(String videoPath) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder("python3", "scripts/transcribe.py", videoPath);
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        // Read output (transcription JSON)
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(output.toString(), new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse transcript", e);
        }
    }
}

