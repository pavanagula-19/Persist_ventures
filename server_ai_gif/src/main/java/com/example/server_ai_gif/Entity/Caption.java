package com.example.server_ai_gif.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Caption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private Double startTime;
    private Double endTime;

    @ManyToOne
    private Video video;

    @OneToOne(mappedBy = "caption", cascade = CascadeType.ALL)
    private Gif gif;
}

