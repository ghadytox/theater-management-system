package com.theater.backend.controller;

import com.theater.backend.model.Booking;
import com.theater.backend.model.Seat;
import com.theater.backend.repository.BookingRepository;
import com.theater.backend.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // Prevent double booking the same seat
        boolean alreadyBooked = bookingRepository
                .findByShowIdAndSeatId(booking.getShowId(), booking.getSeatId())
                .isPresent();
        if (alreadyBooked) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Seat already booked"));
        }

        // Mark seat as booked in MongoDB
        seatRepository.findById(booking.getSeatId()).ifPresent(seat -> {
            seat.setStatus("booked");
            seatRepository.save(seat);
        });

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingRepository.save(booking));
    }
}
