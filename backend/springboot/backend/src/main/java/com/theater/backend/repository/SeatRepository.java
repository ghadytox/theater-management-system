package com.theater.backend.repository;

import com.theater.backend.model.Seat;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SeatRepository extends MongoRepository<Seat, String> {
    List<Seat> findByShowId(String showId);
}
