package com.example.server_ai_gif.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class VideoClippingService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.clip-dir:clips}")
    private String clipDir;

    public List<String> extractClips(String videoFileName, List<Map<String, Object>> segments) throws IOException {
        String inputPath = Paths.get(uploadDir, videoFileName).toString();
        List<String> clipPaths = new ArrayList<>();

        for (int i = 0; i < segments.size(); i++) {
            Map<String, Object> seg = segments.get(i);

            Number startVal = (Number) seg.get("start");
            Number endVal = (Number) seg.get("end");

            double start = startVal.doubleValue();
            double end = endVal.doubleValue();

            double duration = end - start;


            if (duration <= 0) {
                System.err.println("⚠️ Skipping invalid segment: start >= end");
                continue;
            }

            String clipName = videoFileName.replace(".mp4", "") + "_clip" + (i + 1) + ".mp4";
            String outputPath = Paths.get(clipDir, clipName).toString();

            List<String> command = List.of(
                    "ffmpeg",
                    "-ss", String.valueOf(start),
                    "-i", inputPath,
                    "-t", String.valueOf(duration),
                    "-c", "copy",
                    "-y",
                    outputPath
            );

            System.out.println("👉 Running FFmpeg command:");
            System.out.println(String.join(" ", command));

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            StringBuilder ffmpegOutput = new StringBuilder();

            while ((line = reader.readLine()) != null) {
                ffmpegOutput.append(line).append("\n");
            }

            int exitCode;
            try {
                exitCode = process.waitFor();
            } catch (InterruptedException e) {
                throw new RuntimeException("FFmpeg interrupted", e);
            }

            if (exitCode != 0) {
                System.err.println("❌ FFmpeg failed with exit code: " + exitCode);
                System.err.println("----- FFmpeg Output -----");
                System.err.println(ffmpegOutput.toString());
                System.err.println("-------------------------");
                throw new RuntimeException("FFmpeg clipping failed.");
            }

            clipPaths.add("clips/" + clipName);
        }

        return clipPaths;
    }

}
