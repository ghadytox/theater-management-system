package com.theater.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "seats")
public class Seat {
    @Id
    private String id;       // e.g. "1-A3"
    private String showId;
    private String row;
    private int number;
    private String status;   // "available" or "booked"
}
