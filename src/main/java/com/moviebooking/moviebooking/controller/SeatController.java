
package com.moviebooking.moviebooking.controller;

import com.moviebooking.moviebooking.entity.Seat;
import com.moviebooking.moviebooking.entity.BookingSeat;
import com.moviebooking.moviebooking.repository.SeatRepository;
import com.moviebooking.moviebooking.repository.BookingSeatRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin
public class SeatController {

    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public SeatController(
            SeatRepository seatRepository,
            BookingSeatRepository bookingSeatRepository) {
        this.seatRepository = seatRepository;
        this.bookingSeatRepository = bookingSeatRepository;
    }

    @GetMapping
    public List<Seat> getSeatsByScreen(@RequestParam Integer screenId) {
        return seatRepository.findByScreenScreenId(screenId);
    }

    @GetMapping("/availability")
    public List<Map<String, Object>> getSeatAvailability(
            @RequestParam Integer screenId,
            @RequestParam Integer showtimeId) {

        List<Seat> seats =
                seatRepository.findByScreenScreenId(screenId);

        List<BookingSeat> bookedSeats =
                bookingSeatRepository
                .findByBookingShowtimeShowtimeIdAndBookingBookingStatus(
                        showtimeId, "CONFIRMED");

        List<Integer> bookedSeatIds = bookedSeats.stream()
                .map(bs -> bs.getSeat().getSeatId())
                .toList();

        return seats.stream().map(seat -> {
            Map<String, Object> result = new HashMap<>();
            result.put("seatId", seat.getSeatId());
            result.put("seatNumber", seat.getSeatNumber());
            result.put("seatType", seat.getSeatType());
            result.put("booked", bookedSeatIds.contains(seat.getSeatId()));
            return result;
        }).toList();
    }
}
