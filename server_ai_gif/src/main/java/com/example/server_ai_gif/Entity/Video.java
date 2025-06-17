package com.example.server_ai_gif.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String prompt;
    private String status;

    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL)
    private List<Caption> captions;
}
