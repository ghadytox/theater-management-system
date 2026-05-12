import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ShowCard from '../components/ShowCard';

export default function ShowsPage() {
  const { state } = useApp();
  const [genre, setGenre] = useState('All');
  const genres = ['All', ...new Set(state.shows.map((s) => s.genre))];
  const filtered = genre === 'All' ? state.shows : state.shows.filter((s) => s.genre === genre);

  return (
    <div className="container py-5">
      <h2 className="mb-4">All Shows</h2>
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {genres.map((g) => (
          <button
            key={g}
            className={`btn btn-sm ${genre === g ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="row g-4">
        {filtered.map((show) => (
          <div className="col-md-4 col-sm-6" key={show.id}>
            <ShowCard show={show} />
          </div>
        ))}
      </div>
    </div>
  );
}
