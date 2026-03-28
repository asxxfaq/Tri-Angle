import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = ({ transparent = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar" style={transparent ? { background: 'transparent', borderColor: 'transparent' } : {}}>
      <Link to="/" className="navbar-logo">
        <img src="/logo.png" alt="TRI-ANGLE logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
        <span className="navbar-logo-text gradient-text">TRI-ANGLE</span>
      </Link>

      {/* Hamburger Toggle */}
      <div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </div>

      <div className={`navbar-content ${menuOpen ? 'active' : ''}`}>
        <div className="navbar-links" onClick={() => setMenuOpen(false)}>
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/gallery" className="navbar-link">Photo Gallery</Link>
          <Link to="/book" className="navbar-link">Book Now</Link>
          <Link to="/about" className="navbar-link">About</Link>
          <Link to="/contact" className="navbar-link">Contact</Link>
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin/dashboard" className="btn btn-outline btn-sm">Admin Panel</Link>
              ) : (
                <Link to="/my-bookings" className="btn btn-ghost btn-sm">My Bookings</Link>
              )}
              <button onClick={handleLogout} className="btn btn-primary btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
