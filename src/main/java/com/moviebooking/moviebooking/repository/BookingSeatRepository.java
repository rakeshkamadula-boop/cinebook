
package com.moviebooking.moviebooking.repository;

import com.moviebooking.moviebooking.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Integer> {

    boolean existsBySeatSeatIdAndBookingShowtimeShowtimeIdAndBookingBookingStatus(
            Integer seatId,
            Integer showtimeId,
            String bookingStatus
    );

    List<BookingSeat> findByBookingShowtimeShowtimeIdAndBookingBookingStatus(
            Integer showtimeId,
            String bookingStatus
    );
}
