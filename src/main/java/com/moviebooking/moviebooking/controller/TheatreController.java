package com.moviebooking.moviebooking.controller;

import com.moviebooking.moviebooking.entity.Theatre;
import com.moviebooking.moviebooking.repository.TheatreRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/theatres")
@CrossOrigin
public class TheatreController {

    private final TheatreRepository theatreRepository;

    public TheatreController(TheatreRepository theatreRepository) {
        this.theatreRepository = theatreRepository;
    }

    @GetMapping
    public List<Theatre> getAllTheatres() {
        return theatreRepository.findAll();
    }
}