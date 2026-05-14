package com.theater.backend.controller;

import com.theater.backend.model.Show;
import com.theater.backend.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shows")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ShowController {

    private final ShowRepository showRepository;

    @GetMapping
    public List<Show> getAllShows() {
        return showRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Show> getShow(@PathVariable String id) {
        return showRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Show createShow(@RequestBody Show show) {
        return showRepository.save(show);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShow(@PathVariable String id) {
        showRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
