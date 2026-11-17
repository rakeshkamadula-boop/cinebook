
package com.moviebooking.moviebooking.controller;

import com.moviebooking.moviebooking.entity.Booking;
import com.moviebooking.moviebooking.repository.BookingRepository;
import com.moviebooking.moviebooking.service.BookingService;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public BookingController(
            BookingRepository bookingRepository,
            BookingService bookingService) {
        this.bookingRepository = bookingRepository;
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @PostMapping
    public Booking createBooking(@RequestBody Map<String, Object> request) {

        Integer userId = ((Number) request.get("userId")).intValue();
        Integer showtimeId = ((Number) request.get("showtimeId")).intValue();

        List<?> rawSeatIds = (List<?>) request.get("seatIds");

        List<Integer> seatIds = rawSeatIds.stream()
                .map(id -> ((Number) id).intValue())
                .toList();

        return bookingService.createBooking(
                userId, showtimeId, seatIds);
    }

    @PutMapping("/{bookingId}/cancel")
    public Booking cancelBooking(
            @PathVariable Integer bookingId,
            @RequestParam Integer userId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        if (!booking.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized cancellation");
        }

        if ("CANCELLED".equals(booking.getBookingStatus())) {
            throw new RuntimeException("Booking already cancelled");
        }

        booking.setBookingStatus("CANCELLED");

        return bookingRepository.save(booking);
    }
}
