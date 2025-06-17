package com.example.server_ai_gif.repository;

import com.example.server_ai_gif.Entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoRepository extends JpaRepository<Video, Long> {
}

