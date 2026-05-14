import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { createShow, deleteShow } from '../services/api';

const empty = { title: '', genre: 'Drama', date: '', time: '', venue: '', price: '', description: '', image: '' };
const TABS = { SHOWS: 'shows', BOOKINGS: 'bookings', REPORTS: 'reports' };

export default function AdminPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState('');
  const [tab, setTab] = useState(TABS.SHOWS);

  if (state.currentUser.role !== 'admin') {
    return (
      <div className="container py-5 text-center">
        <h4>🔒 Access Denied</h4>
        <p>You must be an admin to view this page.</p>
        <button className="btn btn-dark" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await createShow({ ...form, price: Number(form.price) });
    dispatch({ type: 'ADD_SHOW', show: res.data });
    setForm(empty);
    setPreview('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async (id) => {
    await deleteShow(id);
    dispatch({ type: 'DELETE_SHOW', id });
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm({ ...form, image: url });
  };

  // --- Report calculations ---
  const totalRevenue = state.bookings.reduce((sum, b) => {
    const show = state.shows.find((s) => s.id === b.showId);
    return sum + (show?.price || 0);
  }, 0);

  const totalBookings = state.bookings.length;
  const totalShows = state.shows.length;

  // Bookings per show
  const bookingsPerShow = state.shows.map((show) => {
    const count = state.bookings.filter((b) => b.showId === show.id).length;
    const revenue = count * show.price;
    return { ...show, bookingCount: count, revenue };
  });

  // Bookings per genre
  const revenueByGenre = state.shows.reduce((acc, show) => {
    const count = state.bookings.filter((b) => b.showId === show.id).length;
    acc[show.genre] = (acc[show.genre] || 0) + count * show.price;
    return acc;
  }, {});

  const handlePrint = () => window.print();

  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin Panel</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {[
          [TABS.SHOWS, '🎭 Manage Shows'],
          [TABS.BOOKINGS, '🎟️ Bookings'],
          [TABS.REPORTS, '📊 Reports'],
        ].map(([key, label]) => (
          <li className="nav-item" key={key}>
            <button
              className={`nav-link ${tab === key ? 'active fw-bold' : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      {/* TAB 1: Manage Shows */}
      {tab === TABS.SHOWS && (
        <div className="row g-4">
          <div className="col-md-5">
            <div className="card p-4 shadow-sm">
              <h5 className="mb-3">Add New Show</h5>
              {saved && <div className="alert alert-success py-2">Show added!</div>}
              <form onSubmit={handleAdd}>
                {[['title', 'Title'], ['venue', 'Venue']].map(([f, l]) => (
                  <div className="mb-2" key={f}>
                    <label className="form-label small">{l}</label>
                    <input className="form-control form-control-sm" required value={form[f]} onChange={set(f)} />
                  </div>
                ))}
                <div className="mb-2">
                  <label className="form-label small">Show Image</label>
                  <input type="file" accept="image/*" className="form-control form-control-sm" onChange={handleImage} />
                  {preview && <img src={preview} alt="preview" className="mt-2 rounded" style={{ width: '100%', height: 120, objectFit: 'cover' }} />}
                </div>
                <div className="mb-2">
                  <label className="form-label small">Genre</label>
                  <select className="form-select form-select-sm" value={form.genre} onChange={set('genre')}>
                    <option>Drama</option>
                    <option>Musical</option>
                    <option>Comedy</option>
                    <option>Opera</option>
                  </select>
                </div>
                <div className="row g-2 mb-2">
                  <div className="col">
                    <label className="form-label small">Date</label>
                    <input type="date" className="form-control form-control-sm" required value={form.date} onChange={set('date')} />
                  </div>
                  <div className="col">
                    <label className="form-label small">Time</label>
                    <input type="time" className="form-control form-control-sm" required value={form.time} onChange={set('time')} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small">Price ($)</label>
                  <input type="number" className="form-control form-control-sm" required value={form.price} onChange={set('price')} />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Description</label>
                  <textarea className="form-control form-control-sm" rows={2} value={form.description} onChange={set('description')} />
                </div>
                <button type="submit" className="btn btn-dark w-100">Add Show</button>
              </form>
            </div>
          </div>
          <div className="col-md-7">
            <h5>All Shows ({totalShows})</h5>
            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead className="table-dark">
                  <tr><th>Title</th><th>Date</th><th>Venue</th><th>Price</th><th></th></tr>
                </thead>
                <tbody>
                  {state.shows.map((s) => (
                    <tr key={s.id}>
                      <td>{s.title}</td>
                      <td>{s.date}</td>
                      <td>{s.venue}</td>
                      <td>${s.price}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Bookings */}
      {tab === TABS.BOOKINGS && (
        <div>
          <h5>All Bookings ({totalBookings})</h5>
          {state.bookings.length === 0 ? (
            <p className="text-muted">No bookings yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr><th>#</th><th>Customer</th><th>Show</th><th>Seat</th><th>Payment</th><th>MTN Number</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {state.bookings.map((b, i) => {
                    const show = state.shows.find((s) => s.id === b.showId);
                    return (
                      <tr key={b.id}>
                        <td>{i + 1}</td>
                        <td>{b.customerName}<br /><small className="text-muted">{b.customerEmail}</small></td>
                        <td>{show?.title}</td>
                        <td><span className="badge bg-secondary">{b.seatId?.split('-')[1]}</span></td>
                        <td><span className="badge bg-warning text-dark">{b.paymentMethod || 'MTN MoMo'}</span></td>
                        <td>{b.mtnNumber || '-'}</td>
                        <td><span className="badge bg-success">{b.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Reports */}
      {tab === TABS.REPORTS && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">📊 Revenue & Booking Report</h5>
            <button className="btn btn-outline-dark btn-sm" onClick={handlePrint}>🖨️ Print Report</button>
          </div>

          {/* Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card text-center p-3 border-success">
                <h6 className="text-muted">Total Revenue</h6>
                <h2 className="text-success fw-bold">${totalRevenue}</h2>
                <small>via MTN MoMo</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center p-3 border-primary">
                <h6 className="text-muted">Total Bookings</h6>
                <h2 className="text-primary fw-bold">{totalBookings}</h2>
                <small>confirmed seats</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center p-3 border-dark">
                <h6 className="text-muted">Total Shows</h6>
                <h2 className="fw-bold">{totalShows}</h2>
                <small>active shows</small>
              </div>
            </div>
          </div>

          {/* Revenue per Show */}
          <h6 className="fw-bold mb-3">Revenue per Show</h6>
          <div className="table-responsive mb-4">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr><th>Show</th><th>Genre</th><th>Date</th><th>Price/Seat</th><th>Bookings</th><th>Revenue</th></tr>
              </thead>
              <tbody>
                {bookingsPerShow.map((s) => (
                  <tr key={s.id}>
                    <td>{s.title}</td>
                    <td><span className="badge bg-secondary">{s.genre}</span></td>
                    <td>{s.date}</td>
                    <td>${s.price}</td>
                    <td>{s.bookingCount}</td>
                    <td className="fw-bold text-success">${s.revenue}</td>
                  </tr>
                ))}
                <tr className="table-dark fw-bold">
                  <td colSpan={4}>TOTAL</td>
                  <td>{totalBookings}</td>
                  <td>${totalRevenue}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Revenue by Genre */}
          <h6 className="fw-bold mb-3">Revenue by Genre</h6>
          <div className="row g-3">
            {Object.entries(revenueByGenre).map(([genre, revenue]) => (
              <div className="col-md-3" key={genre}>
                <div className="card text-center p-3">
                  <h6>{genre}</h6>
                  <h4 className="text-success fw-bold">${revenue}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
