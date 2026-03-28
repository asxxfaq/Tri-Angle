import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const MEDIA_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const EMPTY = { name:'', gender:'male', phone:'', skills:'', experience:'', age:'', collegeName:'', notes:'', status:'active', availability: true };

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ gender:'', status:'', search:'' });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const params = { limit:50 };
      if (filters.gender) params.gender = filters.gender;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      const { data } = await api.get('/staff', { params });
      setStaff(data.staff);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, [filters]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setPhoto(null); setModal(true); };
  const openEdit = (s) => {
    setEditing(s._id);
    setForm({ name:s.name, gender:s.gender, phone:s.phone||'', skills:(s.skills||[]).join(', '), experience:s.experience||'', age:s.age||'', collegeName:s.collegeName||'', notes:s.notes||'', status:s.status, availability:s.availability });
    setPhoto(null);
    setModal(true);
  };

  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => fd.append(k, v));
    if (photo) fd.append('photo', photo);
    try {
      if (editing) { await api.put(`/staff/${editing}`, fd); toast.success('Staff updated'); }
      else { await api.post('/staff', fd); toast.success('Staff added'); }
      closeModal(); fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this staff member?')) return;
    try {
      await api.delete(`/staff/${id}`);
      toast.success('Staff removed');
      fetchStaff();
    } catch { toast.error('Failed to delete'); }
  };

  const toggleAvail = async (id, current) => {
    try {
      await api.put(`/staff/${id}`, { availability: !current });
      fetchStaff();
    } catch { toast.error('Failed to update'); }
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.type==='checkbox' ? e.target.checked : e.target.value }));

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 className="admin-title">Staff Management</h1>
            <p className="admin-subtitle">Manage your 400+ catering team members</p>
          </div>
          <button onClick={openAdd} className="btn btn-primary">+ Add Staff</button>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
          <input className="form-input" style={{ maxWidth:250 }} placeholder="🔍 Search..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search:e.target.value }))} />
          <select className="form-input form-select" style={{ maxWidth:150 }} value={filters.gender} onChange={e => setFilters(p => ({ ...p, gender:e.target.value }))}>
            <option value="">All Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select className="form-input form-select" style={{ maxWidth:160 }} value={filters.status} onChange={e => setFilters(p => ({ ...p, status:e.target.value }))}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>

        {/* Table */}
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff</th>
                  <th>Gender</th>
                  <th>Skills</th>
                  <th>College</th>
                  <th>Bookings</th>
                  <th>Status</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign:'center', padding:40 }}><div className="spinner" style={{ margin:'0 auto' }} /></td></tr>
                ) : staff.map(s => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        {s.photo
                          ? <img src={`${MEDIA_BASE}${s.photo}`} alt={s.name} style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover' }} />
                          : <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--bg-secondary)', display:'flex', alignItems:'center', justifyContent:'center' }}>{s.gender==='female'?'👩':'👨'}</div>
                        }
                        <div>
                          <div style={{ fontWeight:600 }}>{s.name}</div>
                          <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{s.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge badge-${s.gender}`}>{s.gender}</span></td>
                    <td style={{ maxWidth:150 }}>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        {(s.skills||[]).slice(0,2).map(sk => (
                          <span key={sk} style={{ fontSize:'0.72rem', padding:'2px 6px', background:'rgba(212,160,41,0.1)', color:'var(--gold)', borderRadius:'var(--radius-full)' }}>{sk}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>{s.collegeName || '-'}</td>
                    <td>{s.totalBookings}</td>
                    <td><span className={`badge badge-${s.status}`}>{s.status}</span></td>
                    <td>
                      <button
                        onClick={() => toggleAvail(s._id, s.availability)}
                        style={{ background: s.availability ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                          color: s.availability ? 'var(--success)' : 'var(--error)',
                          border:'none', borderRadius:'var(--radius-full)', padding:'4px 14px', fontSize:'0.8rem', cursor:'pointer' }}
                      >
                        {s.availability ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => openEdit(s)} className="btn btn-outline btn-sm">Edit</button>
                        <button onClick={() => handleDelete(s._id)} className="btn btn-danger btn-sm">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modal && (
          <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) closeModal(); }}>
            <div className="modal" style={{ maxWidth:600 }}>
              <h3 className="modal-title">{editing ? 'Edit Staff' : 'Add New Staff'}</h3>
              <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div className="grid-2" style={{ gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" value={form.name} onChange={set('name')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select className="form-input form-select" value={form.gender} onChange={set('gender')}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={form.phone} onChange={set('phone')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-input" value={form.age} onChange={set('age')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">College / Institution</label>
                    <input className="form-input" value={form.collegeName} onChange={set('collegeName')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience</label>
                    <input className="form-input" placeholder="e.g. 2 years" value={form.experience} onChange={set('experience')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-input form-select" value={form.status} onChange={set('status')}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Skills (comma separated)</label>
                    <input className="form-input" placeholder="Serving, Table Setting..." value={form.skills} onChange={set('skills')} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Profile Photo</label>
                  <input type="file" accept="image/*" className="form-input" onChange={e => setPhoto(e.target.files[0])} style={{ padding:8 }} />
                  <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Max 5MB. JPG, PNG, WebP</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-input" rows={2} value={form.notes} onChange={set('notes')} style={{ resize:'vertical' }} />
                </div>
                <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                  <button type="button" onClick={closeModal} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Staff'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminStaff;
