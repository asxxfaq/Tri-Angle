import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (loginMethod === 'password') {
        const { data } = await api.post('/auth/login', form);
        login(data);
        toast.success(`Welcome back, ${data.name}!`);
        navigate(data.role === 'admin' ? '/admin/dashboard' : '/');
      } else {
        if (!otpSent) {
          const { data } = await api.post('/auth/login-otp', { email: form.email });
          toast.success(data.message);
          setOtpSent(true);
        } else {
          const { data } = await api.post('/auth/verify-login-otp', { email: form.email, otp });
          login(data);
          toast.success(`Welcome back, ${data.name}!`);
          navigate(data.role === 'admin' ? '/admin/dashboard' : '/');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="flex-center" style={{ flex: 1, padding: '100px 20px 40px', background: 'radial-gradient(ellipse at center, rgba(123,28,46,0.08) 0%, transparent 70%), var(--bg-primary)' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src="/logo.png" alt="TRI-ANGLE logo" style={{ width: 50, height: 50, objectFit: 'contain' }} />
              <span className="navbar-logo-text gradient-text" style={{ fontSize: '1.8rem' }}>TRI-ANGLE</span>
            </Link>
            <h1 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '0.04em' }}>Sign in to your catering account</p>
          </div>

          <div className="card-glass" style={{ padding: '40px' }}>
            <div style={{ display:'flex', marginBottom:'24px', gap:'8px', background:'var(--bg-secondary)', padding:'4px', borderRadius:'var(--radius)' }}>
              <button 
                type="button"
                onClick={() => { setLoginMethod('password'); setOtpSent(false); }}
                style={{ flex:1, padding:'10px', borderRadius:'var(--radius-sm)', border:'none', cursor:'pointer', fontWeight:600, background: loginMethod==='password'?'var(--primary)':'transparent', color: loginMethod==='password'?'#fff':'var(--text-secondary)', transition:'0.3s' }}
              >Password</button>
              <button 
                type="button"
                onClick={() => { setLoginMethod('otp'); form.password=''; }}
                style={{ flex:1, padding:'10px', borderRadius:'var(--radius-sm)', border:'none', cursor:'pointer', fontWeight:600, background: loginMethod==='otp'?'var(--primary)':'transparent', color: loginMethod==='otp'?'#fff':'var(--text-secondary)', transition:'0.3s' }}
              >OTP</button>
            </div>

            <form onSubmit={handleSubmit} className="flex-col gap-5">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={otpSent}
                />
              </div>

              {loginMethod === 'password' && (
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                    <Link to="/forgot-password" style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Forgot?
                    </Link>
                  </div>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
              )}

              {loginMethod === 'otp' && otpSent && (
                <div className="form-group">
                  <label className="form-label">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    style={{ letterSpacing: '0.2em', textAlign: 'center', fontSize: '1.2rem', fontWeight: 600 }}
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
                {loading ? 'Processing...' : loginMethod === 'password' ? 'Sign In' : otpSent ? 'Verify & Login' : 'Send OTP'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'var(--gold)', fontWeight: 600 }}>Create one</Link>
              </p>
              <p style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Admin? <Link to="/admin/login" style={{ color: 'var(--text-secondary)' }}>Staff Access</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
