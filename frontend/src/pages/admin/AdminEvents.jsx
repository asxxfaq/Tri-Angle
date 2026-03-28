import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const EMPTY = { name:'', description:'', icon:'🎉', basePrice:'', pricePerStaff:'' };

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    try { const { data } = await api.get('/events'); setEvents(data); } catch {}
  };

  useEffect(() => { fetchEvents(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (e) => { setEditing(e._id); setForm({ name:e.name, description:e.description||'', icon:e.icon||'🎉', basePrice:e.basePrice, pricePerStaff:e.pricePerStaff }); setModal(true); };

  const handleSave = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    try {
      if (editing) { await api.put(`/events/${editing}`, form); toast.success('Event type updated'); }
      else { await api.post('/events', form); toast.success('Event type created'); }
      setModal(false); fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event type?')) return;
    try { await api.delete(`/events/${id}`); toast.success('Deleted'); fetchEvents(); }
    catch { toast.error('Failed to delete'); }
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
          <div>
            <h1 className="admin-title">Event Types</h1>
            <p className="admin-subtitle">Manage catering event categories and pricing</p>
          </div>
          <button onClick={openAdd} className="btn btn-primary">+ Add Event Type</button>
        </div>

        <div className="grid-4">
          {events.map(e => (
            <div key={e._id} className="card" style={{ textAlign:'center', position:'relative' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:12 }}>{e.icon}</div>
              <h3 style={{ marginBottom:8 }}>{e.name}</h3>
              <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:16 }}>{e.description}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8, background:'var(--bg-secondary)', borderRadius:'var(--radius-sm)', padding:12, marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem' }}>
                  <span style={{ color:'var(--text-secondary)' }}>Base Price</span>
                  <span style={{ color:'var(--gold)', fontWeight:600 }}>₹{e.basePrice.toLocaleString()}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem' }}>
                  <span style={{ color:'var(--text-secondary)' }}>Per Staff/hr</span>
                  <span style={{ color:'var(--gold)', fontWeight:600 }}>₹{e.pricePerStaff}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => openEdit(e)} className="btn btn-outline btn-sm" style={{ flex:1 }}>Edit</button>
                <button onClick={() => handleDelete(e._id)} className="btn btn-danger btn-sm" style={{ flex:1 }}>Del</button>
              </div>
            </div>
          ))}
        </div>

        {modal && (
          <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setModal(false); }}>
            <div className="modal">
              <h3 className="modal-title">{editing ? 'Edit Event Type' : 'Add Event Type'}</h3>
              <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div className="form-group">
                  <label className="form-label">Event Name *</label>
                  <input className="form-input" value={form.name} onChange={set('name')} required placeholder="e.g. Marriage" />
                </div>
                <div className="form-group">
                  <label className="form-label">Icon (Emoji)</label>
                  <input className="form-input" value={form.icon} onChange={set('icon')} placeholder="🎉" maxLength={2} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={2} value={form.description} onChange={set('description')} style={{ resize:'vertical' }} />
                </div>
                <div className="grid-2" style={{ gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Base Price (₹) *</label>
                    <input type="number" className="form-input" value={form.basePrice} onChange={set('basePrice')} required placeholder="5000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Per Staff Per Hour (₹) *</label>
                    <input type="number" className="form-input" value={form.pricePerStaff} onChange={set('pricePerStaff')} required placeholder="800" />
                  </div>
                </div>
                <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                  <button type="button" onClick={() => setModal(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminEvents;
