const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all bookings
router.get('/', (req, res) => {
  const bookings = db.prepare(`
    SELECT b.*, s.title as show_title, s.date, s.time
    FROM bookings b
    JOIN shows s ON b.show_id = s.id
  `).all();
  res.json(bookings);
});

// POST create booking
router.post('/', (req, res) => {
  const { showId, seatId, customerName, customerEmail } = req.body;

  // Prevent double booking
  const existing = db.prepare(
    'SELECT id FROM bookings WHERE show_id = ? AND seat_id = ?'
  ).get(showId, seatId);
  if (existing) return res.status(409).json({ error: 'Seat already booked' });

  // Mark seat as booked
  db.prepare('UPDATE seats SET status = ? WHERE id = ?').run('booked', seatId);

  // Create booking record
  const result = db.prepare(
    'INSERT INTO bookings (show_id, seat_id, customer_name, customer_email) VALUES (?, ?, ?, ?)'
  ).run(showId, seatId, customerName, customerEmail);

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(booking);
});

module.exports = router;
