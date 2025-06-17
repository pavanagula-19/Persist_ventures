package com.example.server_ai_gif.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Paths;
import java.util.List;

@Service
public class GifGenerationService {

    @Value("${file.clip-dir}")
    private String clipDir;

    @Value("${file.gif-dir}")
    private String gifDir;

    public String createGifWithCaption(String clipName, String captionText, int index) throws IOException {
        String clipPath = Paths.get(clipDir, clipName).toString();
        String gifName = clipName.replace(".mp4", "") + "_gif" + index + ".gif";
        String gifPath = Paths.get(gifDir, gifName).toString();

        // Sanitize caption text
        String sanitizedText = captionText.replace("\"", "\\\"");

        List<String> command = List.of(
                "ffmpeg",
                "-i", clipPath,
                "-vf", "drawtext=text='" + sanitizedText + "':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=h-50",
                "-loop", "0",
                "-y",
                gifPath
        );

        ProcessBuilder pb = new ProcessBuilder(command);
        pb.redirectErrorStream(true);
        Process process = pb.start();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            while (reader.readLine() != null) {
                // Consuming FFmpeg output
            }
        }

        return gifPath;
    }
}
