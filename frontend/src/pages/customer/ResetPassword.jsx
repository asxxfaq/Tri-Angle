import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emailParam = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    email: emailParam,
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!emailParam) {
      toast.error('Email is missing from the request');
      navigate('/forgot-password');
    }
  }, [emailParam, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, otp, password, confirmPassword } = formData;

    if (!otp || !password || !confirmPassword) return toast.error('All fields are required');
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (otp.length !== 6) return toast.error('OTP must be 6 digits');

    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { email, otp, password });
      toast.success(data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="flex-center" style={{ flex: 1, padding: '100px 20px 60px' }}>
        <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span className="section-label">Reset Access</span>
            <h2 className="modal-title" style={{ border: 'none', marginBottom: '8px' }}>Reset Password</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Enter the 6-digit code sent to <b>{emailParam}</b>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex-col gap-4">
            <div className="form-group">
              <label className="form-label">6-Digit OTP</label>
              <input
                type="text"
                className="form-input"
                placeholder="123456"
                maxLength={6}
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                required
                style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem', fontWeight: 600 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPass ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{ paddingRight: '46px' }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  style={{ paddingRight: '46px' }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '12px' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Didn't get the code? <Link to="/forgot-password" style={{ color: 'var(--gold)' }}>Resend</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
