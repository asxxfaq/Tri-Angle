import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

const MEDIA_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ gender: '', search: '', page: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const params = { status: 'active', limit: 12, page: filters.page };
      if (filters.gender) params.gender = filters.gender;
      if (filters.search) params.search = filters.search;
      const { data } = await api.get('/staff', { params });
      setStaff(data.staff);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, [filters]);

  return (
    <div style={{ minHeight:'100vh' }}>
      <Navbar />
      <div style={{ paddingTop:100, paddingBottom:80 }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p className="text-gold" style={{ fontWeight:600, marginBottom:12 }}>OUR TEAM</p>
            <h1 style={{ fontSize:'2.5rem', marginBottom:12 }}>Meet <span className="gradient-text">Our Staff</span></h1>
            <p style={{ color:'var(--text-secondary)' }}>400+ trained professional catering team members</p>
          </div>

          {/* Filters */}
          <div style={{ display:'flex', gap:16, marginBottom:40, flexWrap:'wrap', alignItems:'center' }}>
            <input
              className="form-input" style={{ maxWidth:300 }}
              placeholder="🔍 Search staff by name..."
              value={filters.search}
              onChange={e => setFilters(p => ({ ...p, search: e.target.value, page: 1 }))}
            />
            {['', 'male', 'female'].map(g => (
              <button
                key={g}
                onClick={() => setFilters(p => ({ ...p, gender: g, page: 1 }))}
                className={`btn btn-sm ${filters.gender === g ? 'btn-primary' : 'btn-outline'}`}
              >
                {g === '' ? 'All Staff' : g === 'male' ? '👨 Male' : '👩 Female'}
              </button>
            ))}
            <span style={{ color:'var(--text-secondary)', fontSize:'0.9rem', marginLeft:'auto' }}>
              {total} staff found
            </span>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="loading-screen" style={{ minHeight:300 }}>
              <div className="spinner" />
            </div>
          ) : staff.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-secondary)' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>😮</div>
              <p>No staff found for current filters.</p>
            </div>
          ) : (
            <div className="grid-4">
              {staff.map(s => (
                <div key={s._id} className="staff-card">
                  {s.photo
                    ? <img
                        src={`${MEDIA_BASE}${s.photo}`}
                        alt={s.name}
                        className="staff-avatar"
                        onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                      />
                    : null
                  }
                  <div className="staff-avatar-placeholder" style={{ display: s.photo ? 'none' : 'flex' }}>
                    {s.gender === 'female' ? '👩' : '👨'}
                  </div>
                  <div className="staff-info">
                    <h3 className="staff-name">{s.name}</h3>
                    <div style={{ display:'flex', gap:6, marginBottom:8, flexWrap:'wrap' }}>
                      <span className={`badge badge-${s.gender}`}>{s.gender}</span>
                      <span className={`badge badge-${s.status}`}>{s.status}</span>
                    </div>
                    <div className="staff-rating">
                      {'⭐'.repeat(Math.round(s.rating || 4))} {(s.rating || 4).toFixed(1)}
                    </div>
                    {s.skills?.length > 0 && (
                      <div style={{ marginTop:8, display:'flex', gap:4, flexWrap:'wrap' }}>
                        {s.skills.slice(0,2).map(sk => (
                          <span key={sk} style={{ fontSize:'0.72rem', padding:'2px 8px', background:'rgba(212,160,41,0.1)', color:'var(--gold)', borderRadius:'var(--radius-full)' }}>{sk}</span>
                        ))}
                      </div>
                    )}
                    {s.collegeName && <p style={{ fontSize:'0.78rem', color:'var(--text-secondary)', marginTop:8 }}>🎓 {s.collegeName}</p>}
                    <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:4 }}>📋 {s.totalBookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={filters.page === 1}>‹</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} className={`page-btn${filters.page === i+1 ? ' active' : ''}`} onClick={() => setFilters(p => ({ ...p, page: i+1 }))}>{i+1}</button>
              ))}
              <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: Math.min(totalPages, p.page + 1) }))} disabled={filters.page === totalPages}>›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
