package com.example.server_ai_gif.controller;

import com.example.server_ai_gif.Entity.Video;
import com.example.server_ai_gif.repository.VideoRepository;
import com.example.server_ai_gif.services.GifGenerationService;
import com.example.server_ai_gif.services.PromptMatchingService;
import com.example.server_ai_gif.services.PythonTranscriptionService;
import com.example.server_ai_gif.services.VideoClippingService;
import com.example.server_ai_gif.uploads.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoRepository videoRepository;
    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideoWithPrompt(
            @RequestParam("prompt") String prompt,
            @RequestParam("video") MultipartFile file
    ) {
        try {
            String fileName = fileStorageService.storeFile(file);

            Video video = new Video();
            video.setFilename(fileName);
            video.setPrompt(prompt);
            video.setStatus("uploaded");

            videoRepository.save(video);

            return ResponseEntity.ok(Map.of("message", "Video uploaded successfully", "filename", fileName));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "File upload failed"));
        }
    }
    @Autowired
    private PythonTranscriptionService transcriptionService;

    @GetMapping("/transcribe/{videoFileName}")
    public ResponseEntity<?> transcribe(@PathVariable String videoFileName) {
        String videoPath = Paths.get("uploads", videoFileName).toString();

        try {
            List<Map<String, Object>> transcript = transcriptionService.runWhisperTranscription(videoPath);
            return ResponseEntity.ok(transcript);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Transcription failed", "details", e.getMessage()));
        }
    }
    @Autowired
    private PromptMatchingService promptMatchingService;

    @PostMapping("/match")
    public ResponseEntity<?> matchPrompt(@RequestBody Map<String, Object> body) {
        String prompt = (String) body.get("prompt");
        List<Map<String, Object>> transcript = (List<Map<String, Object>>) body.get("transcript");

        try {
            List<Map<String, Object>> matches = promptMatchingService.findMatchingSegments(prompt, transcript);
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Matching failed", "details", e.getMessage()));
        }
    }
    @Autowired
    private VideoClippingService videoClippingService;

    @PostMapping("/clip")
    public ResponseEntity<?> clipSegments(@RequestBody Map<String, Object> body) {
        String videoFileName = (String) body.get("filename");
        List<Map<String, Object>> segments = (List<Map<String, Object>>) body.get("segments");

        try {
            List<String> clips = videoClippingService.extractClips(videoFileName, segments);
            return ResponseEntity.ok(Map.of("clips", clips));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Clipping failed", "details", e.getMessage()));
        }
    }
    @Autowired
    private GifGenerationService gifGenerationService;

    @PostMapping("/generate-gifs")
    public ResponseEntity<?> generateGifs(@RequestBody Map<String, Object> body) {
        List<String> clipNames = (List<String>) body.get("clips");
        List<String> captions = (List<String>) body.get("captions");

        try {
            List<String> gifs = new ArrayList<>();
            for (int i = 0; i < clipNames.size(); i++) {
                String gifPath = gifGenerationService.createGifWithCaption(clipNames.get(i), captions.get(i), i + 1);
                gifs.add(gifPath);
            }
            return ResponseEntity.ok(Map.of("gifs", gifs));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "GIF generation failed", "details", e.getMessage()));
        }
    }


}

