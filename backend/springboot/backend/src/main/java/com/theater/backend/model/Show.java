package com.theater.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "shows")
public class Show {
    @Id
    private String id;
    private String title;
    private String genre;
    private String date;
    private String time;
    private String venue;
    private double price;
    private String image;
    private String description;
}
