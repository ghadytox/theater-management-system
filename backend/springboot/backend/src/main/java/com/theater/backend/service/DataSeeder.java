package com.theater.backend.service;

import com.theater.backend.model.Show;
import com.theater.backend.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ShowRepository showRepository;

    @Override
    public void run(String... args) {
        // Only seed if no shows exist
        if (showRepository.count() == 0) {
            showRepository.saveAll(List.of(
                createShow("Romeo & Juliet", "Drama", "2025-08-10", "19:00", "Main Hall", 25,
                    "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&q=80",
                    "A timeless tale of love and tragedy by William Shakespeare."),
                createShow("The Phantom of the Opera", "Musical", "2025-08-15", "20:00", "Grand Stage", 35,
                    "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&q=80",
                    "Andrew Lloyd Webber's iconic musical masterpiece."),
                createShow("Hamlet", "Drama", "2025-08-20", "18:30", "Black Box Theater", 20,
                    "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&q=80",
                    "Shakespeare's greatest tragedy performed in modern style."),
                createShow("Chicago", "Musical", "2025-08-25", "19:30", "Grand Stage", 30,
                    "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=400&q=80",
                    "The award-winning musical about fame, murder, and jazz.")
            ));
            System.out.println("✅ Database seeded with 4 shows.");
        }
    }

    private Show createShow(String title, String genre, String date, String time,
                             String venue, double price, String image, String description) {
        Show show = new Show();
        show.setTitle(title);
        show.setGenre(genre);
        show.setDate(date);
        show.setTime(time);
        show.setVenue(venue);
        show.setPrice(price);
        show.setImage(image);
        show.setDescription(description);
        return show;
    }
}
