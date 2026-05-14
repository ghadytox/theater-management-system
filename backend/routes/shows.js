const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all shows
router.get('/', (req, res) => {
  const shows = db.prepare('SELECT * FROM shows').all();
  res.json(shows);
});

// GET single show
router.get('/:id', (req, res) => {
  const show = db.prepare('SELECT * FROM shows WHERE id = ?').get(req.params.id);
  if (!show) return res.status(404).json({ error: 'Show not found' });
  res.json(show);
});

// POST add show (admin)
router.post('/', (req, res) => {
  const { title, genre, date, time, venue, price, image, description } = req.body;
  const result = db.prepare(
    'INSERT INTO shows (title, genre, date, time, venue, price, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(title, genre, date, time, venue, price, image, description);
  const newShow = db.prepare('SELECT * FROM shows WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newShow);
});

// DELETE show (admin)
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM shows WHERE id = ?').run(req.params.id);
  res.json({ message: 'Show deleted' });
});

module.exports = router;
