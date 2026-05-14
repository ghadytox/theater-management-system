import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SeatMap from '../components/SeatMap';
import { getSeats, createBooking } from '../services/api';

export default function BookingPage() {
  const { id } = useParams();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const show = state.shows.find((s) => s.id === id);
  const seats = state.seats[id] || [];

  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load seats from backend
  useEffect(() => {
    if (id && !state.seats[id]) {
      getSeats(id).then((res) =>
        dispatch({ type: 'SET_SEATS', showId: id, seats: res.data })
      );
    }
  }, [id, dispatch, state.seats]);

  const toggleSeat = (seatId) =>
    setSelected((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected.length) return setError('Please select at least one seat.');
    if (!form.name || !form.email) return setError('Please fill in all fields.');
    setError('');
    try {
      for (const seatId of selected) {
        const res = await createBooking({
          showId: id,
          seatId,
          customerName: form.name,
          customerEmail: form.email,
        });
        dispatch({ type: 'BOOK_SEAT', showId: id, seatId, booking: res.data });
      }
      setSuccess(true);
      setSelected([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    }
  };

  if (!show) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container py-5">
      <button className="btn btn-link ps-0 mb-3" onClick={() => navigate('/shows')}>← Back to Shows</button>
      <div className="row g-4">
        <div className="col-md-7">
          <h3>{show.title}</h3>
          <p className="text-muted">📅 {show.date} at {show.time} &nbsp;|&nbsp; 📍 {show.venue} &nbsp;|&nbsp; 💵 ${show.price}/seat</p>
          <SeatMap seats={seats} selected={selected} onSelect={toggleSeat} />
        </div>
        <div className="col-md-5">
          <div className="card shadow-sm p-4">
            <h5>Booking Summary</h5>
            <p className="small text-muted">Selected: {selected.length} seat(s)</p>
            <p className="fw-bold">Total: ${selected.length * show.price}</p>
            <hr />
            {success ? (
              <div className="alert alert-success">
                ✅ Booking confirmed!<br />
                <button className="btn btn-sm btn-dark mt-2" onClick={() => navigate('/bookings')}>View My Bookings</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-dark w-100">Confirm Booking</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
