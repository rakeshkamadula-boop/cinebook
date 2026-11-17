package com.moviebooking.moviebooking.controller;

import com.moviebooking.moviebooking.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;
    private final ShowtimeRepository showtimeRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public AdminController(
            MovieRepository movieRepository,
            TheatreRepository theatreRepository,
            ShowtimeRepository showtimeRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository) {

        this.movieRepository = movieRepository;
        this.theatreRepository = theatreRepository;
        this.showtimeRepository = showtimeRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboard() {

        return Map.of(
                "totalMovies", movieRepository.count(),
                "totalTheatres", theatreRepository.count(),
                "totalShowtimes", showtimeRepository.count(),
                "totalBookings", bookingRepository.count(),
                "totalUsers", userRepository.count()
        );
    }
}