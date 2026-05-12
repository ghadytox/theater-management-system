import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { state, dispatch } = useApp();
  const { pathname } = useLocation();
  const isAdmin = state.currentUser.role === 'admin';

  const toggleRole = () =>
    dispatch({
      type: 'SET_USER',
      user: isAdmin
        ? { id: 1, name: 'Guest', role: 'customer' }
        : { id: 99, name: 'Admin', role: 'admin' },
    });

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">🎭 Grand Stage Theater</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {[['/', 'Home'], ['/shows', 'Shows'], ['/bookings', 'My Bookings']].map(([path, label]) => (
            <li className="nav-item" key={path}>
              <Link className={`nav-link ${pathname === path ? 'active' : ''}`} to={path}>{label}</Link>
            </li>
          ))}
          {isAdmin && (
            <li className="nav-item">
              <Link className={`nav-link ${pathname === '/admin' ? 'active' : ''}`} to="/admin">Admin</Link>
            </li>
          )}
        </ul>
        <button className="btn btn-sm btn-outline-light" onClick={toggleRole}>
          {isAdmin ? '👤 Switch to Customer' : '🔑 Switch to Admin'}
        </button>
      </div>
    </nav>
  );
}
