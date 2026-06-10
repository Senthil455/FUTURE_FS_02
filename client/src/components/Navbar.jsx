import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Mini CRM</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Dashboard
        </Link>
        <Link to="/leads" className={location.pathname.startsWith('/leads') ? 'active' : ''}>
          Leads
        </Link>
      </div>
      <div className="nav-user">
        <span>{user?.username}</span>
        <button onClick={logout} className="btn btn-sm">Logout</button>
      </div>
    </nav>
  );
}
