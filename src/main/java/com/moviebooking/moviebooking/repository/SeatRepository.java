
package com.moviebooking.moviebooking.repository;

import com.moviebooking.moviebooking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Integer> {

    List<Seat> findByScreenScreenId(Integer screenId);

}
