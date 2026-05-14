package com.theater.backend.repository;

import com.theater.backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByShowId(String showId);
    Optional<Booking> findByShowIdAndSeatId(String showId, String seatId);
}
