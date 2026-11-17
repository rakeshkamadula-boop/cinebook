package com.moviebooking.moviebooking.controller;

import com.moviebooking.moviebooking.entity.Booking;
import com.moviebooking.moviebooking.repository.BookingRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/my-bookings")
@CrossOrigin
public class MyBookingsController {

    private final BookingRepository bookingRepository;

    public MyBookingsController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/{userId}")
    public List<Booking> getMyBookings(@PathVariable Integer userId) {

        return bookingRepository.findAll()
                .stream()
                .filter(booking ->
                        booking.getUser().getUserId().equals(userId))
                .toList();
    }
}