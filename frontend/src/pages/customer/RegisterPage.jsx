import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      if (!otpSent) {
        const { data } = await api.post('/auth/send-register-otp', { email: form.email });
        toast.success(data.message);
        setOtpSent(true);
      } else {
        const { data } = await api.post('/auth/register', { ...form, otp });
        login(data);
        toast.success('Registration successful! Welcome to TRI-ANGLE!');
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="flex-center" style={{ flex: 1, padding: '100px 20px 60px', background: 'radial-gradient(ellipse at center, rgba(123,28,46,0.08) 0%, transparent 70%), var(--bg-primary)' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src="/logo.png" alt="TRI-ANGLE logo" style={{ width: 50, height: 50, objectFit: 'contain' }} />
              <span className="navbar-logo-text gradient-text" style={{ fontSize: '1.8rem' }}>TRI-ANGLE</span>
            </Link>
            <h1 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Create Account</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '0.04em' }}>Join Kasaragod's elite catering team</p>
          </div>

          <div className="card-glass" style={{ padding: '40px' }}>
            <form onSubmit={handleSubmit} className="flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required disabled={otpSent} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" className="form-input" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required disabled={otpSent} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input type="tel" className="form-input" name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} required disabled={otpSent} />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-input" name="address" placeholder="Your address (optional)" value={form.address} onChange={handleChange} disabled={otpSent} />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input" 
                    name="password" 
                    placeholder="Min. 6 characters" 
                    value={form.password} 
                    onChange={handleChange} 
                    required 
                    disabled={otpSent} 
                    style={{ paddingRight: '46px' }}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={otpSent}
                  >
                    {showPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="form-group">
                  <label className="form-label">Enter 6-digit OTP sent to email</label>
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

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '12px' }}>
                {loading ? 'Processing...' : otpSent ? 'Confirm & Register' : 'Verify Email & Continue'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
