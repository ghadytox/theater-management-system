export const initialShows = [
  {
    id: 1,
    title: 'Romeo & Juliet',
    genre: 'Drama',
    date: '2025-08-10',
    time: '19:00',
    venue: 'Main Hall',
    price: 25,
    image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&q=80',
    description: "A timeless tale of love and tragedy by William Shakespeare.",
  },
  {
    id: 2,
    title: 'The Phantom of the Opera',
    genre: 'Musical',
    date: '2025-08-15',
    time: '20:00',
    venue: 'Grand Stage',
    price: 35,
    image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&q=80',
    description: "Andrew Lloyd Webber's iconic musical masterpiece.",
  },
  {
    id: 3,
    title: 'Hamlet',
    genre: 'Drama',
    date: '2025-08-20',
    time: '18:30',
    venue: 'Black Box Theater',
    price: 20,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&q=80',
    description: "Shakespeare's greatest tragedy performed in modern style.",
  },
  {
    id: 4,
    title: 'Chicago',
    genre: 'Musical',
    date: '2025-08-25',
    time: '19:30',
    venue: 'Grand Stage',
    price: 30,
    image: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=400&q=80',
    description: "The award-winning musical about fame, murder, and jazz.",
  },
];

// Generates a seating grid: 5 rows (A-E) x 8 seats = 40 seats per show
// 25% of seats are randomly pre-booked to simulate real occupancy
export const generateSeats = (showId) => {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  return rows.flatMap((row) =>
    Array.from({ length: 8 }, (_, i) => ({
      id: `${showId}-${row}${i + 1}`,
      row,
      number: i + 1,
      status: Math.random() < 0.25 ? 'booked' : 'available',
    }))
  );
};
