package com.theater.backend.controller;

import com.theater.backend.model.Seat;
import com.theater.backend.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://host.docker.internal:3000"})
public class SeatController {

    private final SeatRepository seatRepository;

    // Returns seats for a show, generating them if they don't exist yet
    @GetMapping("/{showId}")
    public List<Seat> getSeatsByShow(@PathVariable String showId) {
        List<Seat> seats = seatRepository.findByShowId(showId);
        if (seats.isEmpty()) {
            seats = generateSeats(showId);
            seatRepository.saveAll(seats);
        }
        return seats;
    }

    // Generates 5 rows x 8 seats = 40 seats, 25% randomly pre-booked
    private List<Seat> generateSeats(String showId) {
        String[] rows = {"A", "B", "C", "D", "E"};
        List<Seat> seats = new ArrayList<>();
        for (String row : rows) {
            for (int num = 1; num <= 8; num++) {
                Seat seat = new Seat();
                seat.setId(showId + "-" + row + num);
                seat.setShowId(showId);
                seat.setRow(row);
                seat.setNumber(num);
                seat.setStatus(Math.random() < 0.25 ? "booked" : "available");
                seats.add(seat);
            }
        }
        return seats;
    }
}
