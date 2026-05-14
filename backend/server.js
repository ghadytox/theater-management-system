const express = require('express');
const cors = require('cors');

const showsRouter = require('./routes/shows');
const seatsRouter = require('./routes/seats');
const bookingsRouter = require('./routes/bookings');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/shows', showsRouter);
app.use('/api/seats', seatsRouter);
app.use('/api/bookings', bookingsRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
