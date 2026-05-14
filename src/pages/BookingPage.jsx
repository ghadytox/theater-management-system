import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SeatMap from '../components/SeatMap';
import { getSeats, createBooking } from '../services/api';

// Payment steps: details → mtn → processing → success
const STEPS = { DETAILS: 'details', MTN: 'mtn', PROCESSING: 'processing', SUCCESS: 'success' };

export default function BookingPage() {
  const { id } = useParams();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const show = state.shows.find((s) => s.id === id);
  const seats = state.seats[id] || [];

  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [mtnNumber, setMtnNumber] = useState('');
  const [step, setStep] = useState(STEPS.DETAILS);
  const [error, setError] = useState('');

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

  // Step 1: validate details and go to MTN payment step
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!selected.length) return setError('Please select at least one seat.');
    if (!form.name || !form.email) return setError('Please fill in all fields.');
    setError('');
    setStep(STEPS.MTN);
  };

  // Step 2: validate MTN number and simulate payment processing
  const handleMtnSubmit = async (e) => {
    e.preventDefault();
    if (!mtnNumber.match(/^07[0-9]{8}$/)) {
      return setError('Enter a valid MTN number (e.g. 0781234567)');
    }
    setError('');
    setStep(STEPS.PROCESSING);

    // Simulate MTN MoMo processing delay (3 seconds)
    setTimeout(async () => {
      try {
        for (const seatId of selected) {
          const res = await createBooking({
            showId: id,
            seatId,
            customerName: form.name,
            customerEmail: form.email,
            paymentMethod: 'MTN MoMo',
            mtnNumber,
            paymentStatus: 'paid',
          });
          dispatch({ type: 'BOOK_SEAT', showId: id, seatId, booking: res.data });
        }
        setStep(STEPS.SUCCESS);
        setSelected([]);
      } catch (err) {
        setError(err.response?.data?.error || 'Payment failed. Try again.');
        setStep(STEPS.MTN);
      }
    }, 3000);
  };

  if (!show) return <div className="container py-5">Loading...</div>;

  const total = selected.length * show.price;

  return (
    <div className="container py-5">
      <button className="btn btn-link ps-0 mb-3" onClick={() => navigate('/shows')}>← Back to Shows</button>
      <div className="row g-4">

        {/* Seat Map */}
        <div className="col-md-7">
          <h3>{show.title}</h3>
          <p className="text-muted">
            📅 {show.date} at {show.time} &nbsp;|&nbsp;
            📍 {show.venue} &nbsp;|&nbsp;
            💵 ${show.price}/seat
          </p>
          <SeatMap seats={seats} selected={selected} onSelect={toggleSeat} />
        </div>

        {/* Right Panel */}
        <div className="col-md-5">
          <div className="card shadow-sm p-4">
            <h5>Booking Summary</h5>
            <p className="small text-muted">Selected: {selected.length} seat(s)</p>
            <p className="fw-bold fs-5">Total: ${total}</p>
            <hr />

            {/* STEP 1: Customer Details */}
            {step === STEPS.DETAILS && (
              <form onSubmit={handleDetailsSubmit}>
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-dark w-100">
                  Continue to Payment →
                </button>
              </form>
            )}

            {/* STEP 2: MTN MoMo Payment */}
            {step === STEPS.MTN && (
              <form onSubmit={handleMtnSubmit}>
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                <div className="text-center mb-3">
                  <div style={{ fontSize: 48 }}>📱</div>
                  <h6 className="fw-bold text-warning">MTN Mobile Money</h6>
                  <p className="small text-muted">Enter your MTN MoMo number to pay <strong>${total}</strong></p>
                </div>
                <div className="mb-3">
                  <label className="form-label">MTN MoMo Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-warning fw-bold">🇷🇼 +250</span>
                    <input
                      className="form-control"
                      placeholder="078 123 4567"
                      value={mtnNumber}
                      onChange={(e) => setMtnNumber(e.target.value.replace(/\s/g, ''))}
                      maxLength={10}
                    />
                  </div>
                  <small className="text-muted">Format: 078XXXXXXX or 079XXXXXXX</small>
                </div>
                <div className="alert alert-warning py-2 small">
                  💡 You will receive a prompt on your phone to approve the payment of <strong>${total}</strong>
                </div>
                <button type="submit" className="btn btn-warning w-100 fw-bold">
                  Pay ${total} with MTN MoMo
                </button>
                <button type="button" className="btn btn-link w-100 mt-1 small"
                  onClick={() => setStep(STEPS.DETAILS)}>← Back</button>
              </form>
            )}

            {/* STEP 3: Processing */}
            {step === STEPS.PROCESSING && (
              <div className="text-center py-4">
                <div className="spinner-border text-warning mb-3" style={{ width: 50, height: 50 }} />
                <h6 className="fw-bold">Processing Payment...</h6>
                <p className="small text-muted">Please check your phone <strong>{mtnNumber}</strong> and approve the MTN MoMo request.</p>
                <div className="progress mt-3">
                  <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning w-100" />
                </div>
              </div>
            )}

            {/* STEP 4: Success */}
            {step === STEPS.SUCCESS && (
              <div className="text-center py-3">
                <div style={{ fontSize: 56 }}>✅</div>
                <h5 className="fw-bold text-success mt-2">Payment Successful!</h5>
                <p className="small text-muted">
                  <strong>${total}</strong> paid via MTN MoMo<br />
                  Number: {mtnNumber}<br />
                  Booking confirmed for <strong>{form.name}</strong>
                </p>
                <hr />
                <button className="btn btn-dark w-100"
                  onClick={() => navigate('/bookings')}>
                  View My Bookings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
