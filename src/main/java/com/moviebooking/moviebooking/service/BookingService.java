package com.moviebooking.moviebooking.service;

import com.moviebooking.moviebooking.entity.*;
import com.moviebooking.moviebooking.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository,
            ShowtimeRepository showtimeRepository,
            SeatRepository seatRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Booking createBooking(
            Integer userId,
            Integer showtimeId,
            List<Integer> seatIds) {

        if (seatIds == null || seatIds.isEmpty()) {
            throw new RuntimeException("Please select at least one seat");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        if (seatIds.stream().distinct().count() != seatIds.size()) {
            throw new RuntimeException("Duplicate seats selected");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShowtime(showtime);
        booking.setBookingDate(LocalDateTime.now());
        booking.setBookingStatus("CONFIRMED");

        double totalAmount = 0;

        for (Integer seatId : seatIds) {

            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat not found"));

            if (!seat.getScreen().getScreenId()
                    .equals(showtime.getScreen().getScreenId())) {
                throw new RuntimeException("Seat belongs to another screen");
            }

            boolean alreadyBooked =
                    bookingSeatRepository
                    .existsBySeatSeatIdAndBookingShowtimeShowtimeIdAndBookingBookingStatus(
                            seatId, showtimeId, "CONFIRMED");

            if (alreadyBooked) {
                throw new RuntimeException(
                        "Seat " + seat.getSeatNumber() + " is already booked");
            }

            double price = showtime.getTicketPrice();

            if ("Premium".equalsIgnoreCase(seat.getSeatType())) {
                price = 300;
            } else if ("Gold".equalsIgnoreCase(seat.getSeatType())) {
                price = 220;
            } else if ("Silver".equalsIgnoreCase(seat.getSeatType())) {
                price = 150;
            }

            totalAmount += price;
        }

        booking.setTotalAmount(totalAmount);
        Booking savedBooking = bookingRepository.save(booking);

        for (Integer seatId : seatIds) {

            Seat seat = seatRepository.findById(seatId).get();

            double price = showtime.getTicketPrice();

            if ("Premium".equalsIgnoreCase(seat.getSeatType())) {
                price = 300;
            } else if ("Gold".equalsIgnoreCase(seat.getSeatType())) {
                price = 220;
            } else if ("Silver".equalsIgnoreCase(seat.getSeatType())) {
                price = 150;
            }

            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setBooking(savedBooking);
            bookingSeat.setSeat(seat);
            bookingSeat.setTicketPrice(price);

            bookingSeatRepository.save(bookingSeat);
        }

        return savedBooking;
    }
}