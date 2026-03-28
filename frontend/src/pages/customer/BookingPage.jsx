import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import CalendarPicker from '../../components/CalendarPicker';

const BookingPage = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({
    eventType: '', eventName: '', eventDate: '', eventTime: '09:00',
    venueName: '', venueAddress: '', city: 'Kasaragod', distance: 10,
    maleStaff: 2, femaleStaff: 3,
    duration: 8, contactPerson: '', contactPhone: '',
    notes: '', specialRequirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/events').then(r => { setEventTypes(r.data); setLoadingEvents(false); }).catch(() => setLoadingEvents(false));
  }, []);

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm(p => ({ ...p, [k]: val }));
    if (k === 'eventType') {
      const ev = eventTypes.find(et => et._id === val);
      setSelectedEvent(ev || null);
    }
  };

  const mStaff = parseInt(form.maleStaff) || 0;
  const fStaff = parseInt(form.femaleStaff) || 0;
  const totalStaff = mStaff + fStaff;

  const staffCharge = totalStaff * 850;
  const travelCharge = (form.distance || 0) * 10;
  const estimatedAmount = selectedEvent ? staffCharge + travelCharge : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalStaff < 1) { toast.error('At least 1 staff member is required'); return; }
    if (!form.eventType) { toast.error('Please select an event type'); return; }
    setLoading(true);
    try {
      await api.post('/bookings', form);
      toast.success('🎉 Booking submitted! We will confirm shortly.');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh' }}>
      <Navbar />
      <div style={{ paddingTop:100, paddingBottom:80 }}>
        <div className="container" style={{ maxWidth:800 }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p className="text-gold" style={{ fontWeight:600, marginBottom:12 }}>BOOK NOW</p>
            <h1 style={{ fontSize:'2.2rem', marginBottom:12 }}>Book <span className="gradient-text">Catering Staff</span></h1>
            <p style={{ color:'var(--text-secondary)' }}>Fill in your event details and we'll arrange the best team for you</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

              {/* Event Type Cards */}
              <div>
                <label className="form-label" style={{ marginBottom:16, display:'block', fontSize:'1rem', fontWeight:600 }}>
                  Select Event Type *
                </label>
                {loadingEvents ? (
                  <div className="flex-center" style={{ height:100 }}><div className="spinner" /></div>
                ) : (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
                    {eventTypes.map(et => (
                      <div
                        key={et._id}
                        onClick={() => { setForm(p => ({ ...p, eventType: et._id })); setSelectedEvent(et); }}
                        style={{
                          padding:16, borderRadius:'var(--radius)', border:`2px solid ${form.eventType === et._id ? 'var(--gold)' : 'var(--border)'}`,
                          background: form.eventType === et._id ? 'rgba(212,160,41,0.1)' : 'var(--bg-card)',
                          cursor:'pointer', textAlign:'center', transition:'var(--transition)'
                        }}
                      >
                        <div style={{ fontSize:'1.8rem', marginBottom:6 }}>{et.icon}</div>
                        <div style={{ fontSize:'0.85rem', fontWeight:600 }}>{et.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="card">
                <h3 style={{ marginBottom:20, color:'var(--gold)' }}>📋 Event Details</h3>
                <div className="grid-2" style={{ gap:16 }}>
                  <div className="form-group">
                    <label className="form-label" style={{ marginBottom: 12 }}>Event Date *</label>
                    <CalendarPicker 
                      selectedDate={form.eventDate} 
                      onChange={(date) => setForm(p => ({ ...p, eventDate: date }))}
                      minDate={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event Time *</label>
                    <input type="time" className="form-input" value={form.eventTime} onChange={set('eventTime')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (hours)</label>
                    <select className="form-input form-select" value={form.duration} onChange={set('duration')}>
                      {[4,6,8,10,12,16,24].map(h => <option key={h} value={h}>{h} hours</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div className="card">
                <h3 style={{ marginBottom:20, color:'var(--gold)' }}>📍 Venue Details</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Venue / Hall Name *</label>
                    <input className="form-input" placeholder="e.g. Kasaragod Community Hall" value={form.venueName} onChange={set('venueName')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Address *</label>
                    <textarea className="form-input" rows={2} placeholder="Street, landmark..." value={form.venueAddress} onChange={set('venueAddress')} required style={{ resize:'vertical' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City / Town *</label>
                    <input className="form-input" placeholder="e.g. Kasaragod" value={form.city} onChange={set('city')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Distance from Office (km) *</label>
                    <input type="number" className="form-input" min={0} value={form.distance} onChange={set('distance')} required />
                  </div>
                </div>
              </div>

              {/* Staff Requirements */}
              <div className="card">
                <h3 style={{ marginBottom:20, color:'var(--gold)' }}>👥 Staff Requirements</h3>
                <div className="grid-2" style={{ gap:16, alignItems: 'end' }}>
                  <div className="form-group">
                    <label className="form-label">Male Staff Needed *</label>
                    <input type="number" className="form-input" min={0} max={200} value={form.maleStaff}
                      onChange={e => setForm(p => ({ ...p, maleStaff: parseInt(e.target.value) || 0 }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Female Staff Needed *</label>
                    <input type="number" className="form-input" min={0} max={200} value={form.femaleStaff}
                      onChange={e => setForm(p => ({ ...p, femaleStaff: parseInt(e.target.value) || 0 }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Person *</label>
                    <input className="form-input" placeholder="Contact person at event" value={form.contactPerson} onChange={set('contactPerson')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone *</label>
                    <input type="tel" className="form-input" placeholder="+91 XXXXX XXXXX" value={form.contactPhone} onChange={set('contactPhone')} required />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="card">
                <h3 style={{ marginBottom:20, color:'var(--gold)' }}>📝 Additional Information</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Special Requirements</label>
                    <textarea className="form-input" rows={2} placeholder="Any special food handling, dress code, etc." value={form.specialRequirements} onChange={set('specialRequirements')} style={{ resize:'vertical' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Additional Notes</label>
                    <textarea className="form-input" rows={2} placeholder="Anything else we should know..." value={form.notes} onChange={set('notes')} style={{ resize:'vertical' }} />
                  </div>
                </div>
              </div>

              {/* Price Estimate */}
              {selectedEvent && (
                <div style={{ background:'rgba(212,160,41,0.08)', border:'1px solid var(--border-gold)', borderRadius:'var(--radius)', padding:24 }}>
                  <h3 style={{ marginBottom:16, color:'var(--gold)' }}>💰 Cost Estimate</h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', color:'var(--text-secondary)' }}>
                      <span>{totalStaff} staff × ₹850 per person</span>
                      <span>₹{staffCharge.toLocaleString()}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', color:'var(--text-secondary)' }}>
                      <span>Travel Charge ({form.distance || 0} km × ₹10)</span>
                      <span>₹{travelCharge.toLocaleString()}</span>
                    </div>
                    <div style={{ borderTop:'1px solid var(--border-gold)', paddingTop:12, display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:'1.1rem' }}>
                      <span>Estimated Total</span>
                      <span className="text-gold">₹{estimatedAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:12 }}>* Final amount may vary based on actual requirements</p>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width:'100%' }}>
                {loading ? 'Submitting Booking...' : '🎉 Submit Booking Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
