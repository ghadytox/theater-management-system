package com.theater.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String showId;
    private String seatId;
    private String customerName;
    private String customerEmail;
    private String status = "confirmed";
    private LocalDateTime bookedAt = LocalDateTime.now();
}
