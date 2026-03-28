import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      if (data.role !== 'admin') { toast.error('Access denied. Admin only.'); return; }
      login(data);
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      background: 'radial-gradient(ellipse at center, rgba(123,28,46,0.1) 0%, transparent 70%), var(--bg-primary)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="TRI-ANGLE logo" style={{ width: 60, height: 60, margin: '0 auto 16px', display: 'block', objectFit: 'contain' }} />
          <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: 8 }}>Admin Portal</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '0.04em' }}>TRI-ANGLE Staff Access</p>
        </div>

        <div className="card-glass" style={{ padding: 40 }}>
          <form onSubmit={handleSubmit} className="flex-col gap-5">
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input type="email" className="form-input" placeholder="admin@triangle.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            
            <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)', padding: 12, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <b>💡 Hint:</b><br />
              admin@triangle.com / admin123
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? 'Authenticating...' : '🔐 Secure Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>← Back to Website</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
