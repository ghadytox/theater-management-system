import { useApp } from '../context/AppContext';

export default function BookingsPage() {
  const { state } = useApp();
  const { bookings, shows } = state;

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-muted">No bookings yet. <a href="/shows">Browse shows</a> to get started.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Show</th>
                <th>Date & Time</th>
                <th>Seat</th>
                <th>Customer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => {
                const show = shows.find((s) => s.id === b.showId);
                return (
                  <tr key={b.id}>
                    <td>{i + 1}</td>
                    <td>{show?.title}</td>
                    <td>{show?.date} {show?.time}</td>
                    <td><span className="badge bg-secondary">{b.seatId.split('-')[1]}</span></td>
                    <td>{b.customerName}<br /><small className="text-muted">{b.customerEmail}</small></td>
                    <td><span className="badge bg-success">{b.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
