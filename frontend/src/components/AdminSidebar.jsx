import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const path = window.location.pathname;

  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/bookings', label: 'Bookings', icon: '📋' },
    { to: '/admin/customers', label: 'Customers', icon: '👤' },
    { to: '/admin/events', label: 'Event Types', icon: '🎉' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <img src="/logo.png" alt="TRI-ANGLE logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <span style={{ fontFamily:'Cormorant Garamond,serif', fontWeight:600, fontSize:'1.2rem' }} className="gradient-text">TRI-ANGLE</span>
        </Link>
        <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:6 }}>Admin Panel</p>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`sidebar-link${path === l.to ? ' active' : ''}`}>
            <span style={{ fontSize:'1.1rem' }}>{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>
      <div style={{ padding:'16px', borderTop:'1px solid var(--border)' }}>
        <div style={{ marginBottom:12, fontSize:'0.85rem', color:'var(--text-secondary)' }}>
          👋 {user?.name}
        </div>
        <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline btn-sm" style={{ width:'100%' }}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
