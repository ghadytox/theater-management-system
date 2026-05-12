import { Link } from 'react-router-dom';

export default function ShowCard({ show }) {
  return (
    <div className="card h-100 shadow-sm">
      <img src={show.image} className="card-img-top" alt={show.title} style={{ height: 180, objectFit: 'cover' }} />
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary mb-2 align-self-start">{show.genre}</span>
        <h5 className="card-title">{show.title}</h5>
        <p className="card-text text-muted small">{show.description}</p>
        <ul className="list-unstyled small mt-auto mb-3">
          <li>📅 {show.date} at {show.time}</li>
          <li>📍 {show.venue}</li>
          <li>💵 ${show.price} per seat</li>
        </ul>
        <Link to={`/booking/${show.id}`} className="btn btn-dark w-100">Book Seats</Link>
      </div>
    </div>
  );
}
