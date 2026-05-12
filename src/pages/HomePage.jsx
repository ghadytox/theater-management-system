import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ShowCard from '../components/ShowCard';

export default function HomePage() {
  const { state } = useApp();
  const upcoming = state.shows.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <div className="bg-dark text-white text-center py-5 px-3">
        <h1 className="display-4 fw-bold">🎭 Grand Stage Theater</h1>
        <p className="lead">Experience world-class performances in the heart of the city.</p>
        <Link to="/shows" className="btn btn-light btn-lg mt-2">Browse Shows</Link>
      </div>

      {/* Upcoming Shows */}
      <div className="container py-5">
        <h2 className="mb-4">Upcoming Shows</h2>
        <div className="row g-4">
          {upcoming.map((show) => (
            <div className="col-md-4" key={show.id}>
              <ShowCard show={show} />
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/shows" className="btn btn-outline-dark">View All Shows</Link>
        </div>
      </div>
    </div>
  );
}
