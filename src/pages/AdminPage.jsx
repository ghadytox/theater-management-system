import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const empty = { title: '', genre: 'Drama', date: '', time: '', venue: '', price: '', description: '', image: '' };

export default function AdminPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [saved, setSaved] = useState(false);

  if (state.currentUser.role !== 'admin') {
    return (
      <div className="container py-5 text-center">
        <h4>🔒 Access Denied</h4>
        <p>You must be an admin to view this page.</p>
        <button className="btn btn-dark" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_SHOW', show: { ...form, price: Number(form.price) } });
    setForm(empty);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin Panel</h2>
      <div className="row g-4">
        {/* Add Show Form */}
        <div className="col-md-5">
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Add New Show</h5>
            {saved && <div className="alert alert-success py-2">Show added!</div>}
            <form onSubmit={handleAdd}>
              {[['title', 'Title'], ['venue', 'Venue'], ['image', 'Image URL']].map(([f, l]) => (
                <div className="mb-2" key={f}>
                  <label className="form-label small">{l}</label>
                  <input className="form-control form-control-sm" required value={form[f]} onChange={set(f)} />
                </div>
              ))}
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

        {/* Shows Table */}
        <div className="col-md-7">
          <h5>Manage Shows ({state.shows.length})</h5>
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
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => dispatch({ type: 'DELETE_SHOW', id: s.id })}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bookings Summary */}
          <h5 className="mt-4">All Bookings ({state.bookings.length})</h5>
          {state.bookings.length === 0 ? (
            <p className="text-muted small">No bookings yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead className="table-dark">
                  <tr><th>Customer</th><th>Show</th><th>Seat</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {state.bookings.map((b) => {
                    const show = state.shows.find((s) => s.id === b.showId);
                    return (
                      <tr key={b.id}>
                        <td>{b.customerName}</td>
                        <td>{show?.title}</td>
                        <td>{b.seatId.split('-')[1]}</td>
                        <td><span className="badge bg-success">{b.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
