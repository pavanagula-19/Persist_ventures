package com.example.server_ai_gif.repository;

import com.example.server_ai_gif.Entity.Caption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaptionRepository extends JpaRepository<Caption, Long> {
}

