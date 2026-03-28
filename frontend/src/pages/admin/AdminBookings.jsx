import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const statusColors = { pending:'badge-pending', confirmed:'badge-confirmed', completed:'badge-completed', cancelled:'badge-cancelled', 'in-progress':'badge-in-progress' };

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ status:'', adminNotes:'', totalAmount:'', advancePaid:'' });
  const [saving, setSaving] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { limit:50 };
      if (filter) params.status = filter;
      const { data } = await api.get('/bookings', { params });
      setBookings(data.bookings);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const openModal = (b) => {
    setSelected(b);
    setForm({ status: b.status, adminNotes: b.adminNotes||'', totalAmount: b.totalAmount||'', advancePaid: b.advancePaid||'' });
    setModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/bookings/${selected._id}`, form);
      toast.success('Booking updated!');
      setModal(false);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Booking Management</h1>
          <p className="admin-subtitle">Review and manage all catering booking requests</p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
          {['', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}>
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Event</th>
                  <th>Venue & City</th>
                  <th>Date</th>
                  <th>Staff</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign:'center', padding:40 }}><div className="spinner" style={{ margin:'0 auto' }} /></td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign:'center', color:'var(--text-secondary)', padding:40 }}>No bookings found</td></tr>
                ) : bookings.map(b => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ fontWeight:600 }}>{b.customer?.name}</div>
                      <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{b.customer?.phone}</div>
                    </td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:6, fontWeight:500 }}>
                        {b.eventType?.icon} {b.eventType?.name}
                      </div>
                      <div style={{ fontSize:'0.78rem', color:'var(--text-secondary)' }}>{b.eventName}</div>
                    </td>
                    <td>
                      <div style={{ fontSize:'0.875rem' }}>{b.venueName}</div>
                      <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>📍 {b.city}</div>
                    </td>
                    <td style={{ fontSize:'0.875rem' }}>{b.eventDate ? format(new Date(b.eventDate), 'dd MMM yy') : '-'}</td>
                    <td>
                      <div style={{ fontWeight:600 }}>{b.numberOfStaff} Total</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{b.maleStaff || 0}M, {b.femaleStaff || 0}F</div>
                    </td>
                    <td style={{ color:'var(--gold)', fontWeight:600 }}>₹{b.totalAmount?.toLocaleString()}</td>
                    <td><span className={`badge ${statusColors[b.status]}`}>{b.status}</span></td>
                    <td>
                      <button onClick={() => openModal(b)} className="btn btn-outline btn-sm">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manage Modal */}
        {modal && selected && (
          <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setModal(false); }}>
            <div className="modal">
              <h3 className="modal-title">Manage Booking</h3>
              <div style={{ background:'var(--bg-secondary)', borderRadius:'var(--radius-sm)', padding:16, marginBottom:20, fontSize:'0.875rem' }}>
                <div style={{ fontWeight:600, marginBottom:4 }}>{selected.eventName} — {selected.eventType?.name}</div>
                <div style={{ color:'var(--text-secondary)' }}>
                  👤 {selected.customer?.name} · 📅 {selected.eventDate ? format(new Date(selected.eventDate), 'dd MMM yyyy') : '-'}
                </div>
                <div style={{ color:'var(--text-secondary)' }}>
                  📍 {selected.venueName}, {selected.city} ({selected.distance || 0} km) · 👥 {selected.numberOfStaff} staff ({selected.maleStaff || 0}M, {selected.femaleStaff || 0}F)
                </div>
              </div>
              <form onSubmit={handleUpdate} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div className="form-group">
                  <label className="form-label">Update Status</label>
                  <select className="form-input form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status:e.target.value }))}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="grid-2" style={{ gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Total Amount (₹)</label>
                    <input type="number" className="form-input" value={form.totalAmount} onChange={e => setForm(p => ({ ...p, totalAmount:e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Advance Paid (₹)</label>
                    <input type="number" className="form-input" value={form.advancePaid} onChange={e => setForm(p => ({ ...p, advancePaid:e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Admin Notes / Message to Customer</label>
                  <textarea className="form-input" rows={3} value={form.adminNotes} onChange={e => setForm(p => ({ ...p, adminNotes:e.target.value }))} placeholder="Team will arrive by 8am..." style={{ resize:'vertical' }} />
                </div>
                <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                  <button type="button" onClick={() => setModal(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update Booking'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminBookings;
