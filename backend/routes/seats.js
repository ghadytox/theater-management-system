const express = require('express');
const router = express.Router();
const db = require('../db');

// GET seats for a show — generate if not yet created
router.get('/:showId', (req, res) => {
  const showId = Number(req.params.showId);
  let seats = db.prepare('SELECT * FROM seats WHERE show_id = ?').all(showId);

  // Generate seats if this show has none yet
  if (seats.length === 0) {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const insert = db.prepare(
      'INSERT INTO seats (id, show_id, row, number, status) VALUES (?, ?, ?, ?, ?)'
    );
    const insertMany = db.transaction(() => {
      rows.forEach((row) => {
        for (let num = 1; num <= 8; num++) {
          const status = Math.random() < 0.25 ? 'booked' : 'available';
          insert.run(`${showId}-${row}${num}`, showId, row, num, status);
        }
      });
    });
    insertMany();
    seats = db.prepare('SELECT * FROM seats WHERE show_id = ?').all(showId);
  }

  res.json(seats);
});

module.exports = router;
