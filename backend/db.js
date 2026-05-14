const Database = require('better-sqlite3');
const db = new Database('theater.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    venue TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS seats (
    id TEXT PRIMARY KEY,
    show_id INTEGER NOT NULL,
    row TEXT NOT NULL,
    number INTEGER NOT NULL,
    status TEXT DEFAULT 'available',
    FOREIGN KEY (show_id) REFERENCES shows(id)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER NOT NULL,
    seat_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed',
    booked_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (show_id) REFERENCES shows(id),
    FOREIGN KEY (seat_id) REFERENCES seats(id)
  );
`);

// Seed shows if empty
const count = db.prepare('SELECT COUNT(*) as c FROM shows').get();
if (count.c === 0) {
  const insert = db.prepare(
    'INSERT INTO shows (title, genre, date, time, venue, price, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  insert.run('Romeo & Juliet', 'Drama', '2025-08-10', '19:00', 'Main Hall', 25,
    'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&q=80',
    'A timeless tale of love and tragedy by William Shakespeare.');
  insert.run('The Phantom of the Opera', 'Musical', '2025-08-15', '20:00', 'Grand Stage', 35,
    'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&q=80',
    "Andrew Lloyd Webber's iconic musical masterpiece.");
  insert.run('Hamlet', 'Drama', '2025-08-20', '18:30', 'Black Box Theater', 20,
    'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&q=80',
    "Shakespeare's greatest tragedy performed in modern style.");
  insert.run('Chicago', 'Musical', '2025-08-25', '19:30', 'Grand Stage', 30,
    'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=400&q=80',
    'The award-winning musical about fame, murder, and jazz.');
}

module.exports = db;
