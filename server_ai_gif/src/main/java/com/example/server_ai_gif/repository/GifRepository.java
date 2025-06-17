package com.example.server_ai_gif.repository;

import com.example.server_ai_gif.Entity.Gif;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GifRepository extends JpaRepository<Gif, Long> {
}
