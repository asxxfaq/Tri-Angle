import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import { format } from 'date-fns';

const statusSteps = ['pending', 'confirmed', 'in-progress', 'completed'];

const BookingDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/bookings/${id}`)
      .then(r => setBooking(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!booking) return <div style={{ padding:40, textAlign:'center' }}>Booking not found</div>;

  const currentStep = statusSteps.indexOf(booking.status);

  return (
    <div style={{ minHeight:'100vh' }}>
      <Navbar />
      <div style={{ paddingTop:100, paddingBottom:80 }}>
        <div className="container" style={{ maxWidth:800 }}>
          <div style={{ marginBottom:24 }}>
            <Link to="/my-bookings" style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>← Back to My Bookings</Link>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:32, flexWrap:'wrap', gap:16 }}>
            <div>
              <h1 style={{ fontSize:'2rem', marginBottom:4 }}>{booking.eventName}</h1>
              <p style={{ color:'var(--text-secondary)' }}>Booking ID: {booking._id}</p>
            </div>
            <span className={`badge badge-${booking.status}`} style={{ fontSize:'0.95rem', padding:'8px 20px' }}>{booking.status.toUpperCase()}</span>
          </div>

          {/* Status Timeline */}
          <div className="card" style={{ marginBottom:24 }}>
            <h3 style={{ marginBottom:20, color:'var(--gold)' }}>📍 Booking Status</h3>
            <div style={{ display:'flex', gap:0, overflowX:'auto' }}>
              {statusSteps.map((step, i) => (
                <div key={step} style={{ flex:1, textAlign:'center', position:'relative' }}>
                  {i < statusSteps.length - 1 && (
                    <div style={{ position:'absolute', top:15, left:'50%', width:'100%', height:2, background: i < currentStep ? 'var(--gold)' : 'var(--border)', zIndex:0 }} />
                  )}
                  <div style={{
                    width:32, height:32, borderRadius:'50%', margin:'0 auto 8px',
                    background: i <= currentStep ? 'linear-gradient(135deg, var(--gold), var(--amber))' : 'var(--bg-secondary)',
                    border: `2px solid ${i <= currentStep ? 'var(--gold)' : 'var(--border)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'0.85rem', color: i <= currentStep ? '#070b14' : 'var(--text-muted)',
                    position:'relative', zIndex:1
                  }}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize:'0.8rem', fontWeight:500, color: i <= currentStep ? 'var(--text-primary)' : 'var(--text-muted)', textTransform:'capitalize' }}>
                    {step.replace('-', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid-2" style={{ marginBottom:24 }}>
            <div className="card">
              <h3 style={{ marginBottom:16, color:'var(--gold)' }}>📋 Event Details</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  ['Event Type', `${booking.eventType?.icon} ${booking.eventType?.name}`],
                  ['Date', booking.eventDate ? format(new Date(booking.eventDate), 'EEEE, dd MMMM yyyy') : '-'],
                  ['Time', booking.eventTime],
                  ['Duration', `${booking.duration} hours`],
                  ['Booked On', format(new Date(booking.createdAt), 'dd MMM yyyy')],
                ].map(([k, v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:8 }}>
                    <span style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>{k}</span>
                    <span style={{ fontWeight:500, fontSize:'0.875rem' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom:16, color:'var(--gold)' }}>📍 Venue Details</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  ['Venue', booking.venueName],
                  ['Address', booking.venueAddress],
                  ['City', booking.city],
                  ['Distance', `${booking.distance || 0} km`],
                  ['Contact', booking.contactPerson],
                  ['Phone', booking.contactPhone],
                ].map(([k, v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:8, gap:8 }}>
                    <span style={{ color:'var(--text-secondary)', fontSize:'0.875rem', flexShrink:0 }}>{k}</span>
                    <span style={{ fontWeight:500, fontSize:'0.875rem', textAlign:'right' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Staff & Payment */}
          <div className="grid-2" style={{ marginBottom:24 }}>
            <div className="card">
              <h3 style={{ marginBottom:16, color:'var(--gold)' }}>👥 Staff Requirements</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  ['Total Staff', `${booking.numberOfStaff} persons`],
                  ['Staff Breakdown', `${booking.maleStaff || 0} Male, ${booking.femaleStaff || 0} Female`],
                  ['Assigned Staff', booking.staffAssigned?.length > 0 ? `${booking.staffAssigned.length} assigned` : 'Pending assignment'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:2 }}>{k}</div>
                    <div style={{ fontWeight:500 }}>{v}</div>
                  </div>
                ))}
              </div>
              {booking.staffAssigned?.length > 0 && (
                <div style={{ marginTop:16 }}>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:8 }}>Assigned Team:</div>
                  {booking.staffAssigned.map(s => (
                    <div key={s._id} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:'1.2rem' }}>{s.gender === 'female' ? '👩' : '👨'}</span>
                      <div>
                        <div style={{ fontSize:'0.875rem', fontWeight:500 }}>{s.name}</div>
                        <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)' }}>{s.gender}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <h3 style={{ marginBottom:16, color:'var(--gold)' }}>💰 Payment Details</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  ['Staff Charge', `₹${(booking.numberOfStaff * 850).toLocaleString()}`],
                  ['Travel Charge', `₹${(booking.travelCharge || 0).toLocaleString()}`],
                  ['Total Amount', `₹${booking.totalAmount?.toLocaleString()}`],
                  ['Advance Paid', `₹${(booking.advancePaid || 0).toLocaleString()}`],
                  ['Balance Due', `₹${((booking.totalAmount || 0) - (booking.advancePaid || 0)).toLocaleString()}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:8 }}>
                    <span style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>{k}</span>
                    <span style={{ fontWeight:700, fontSize:'0.875rem', color: k === 'Total Amount' ? 'var(--gold)' : 'inherit' }}>{v}</span>
                  </div>
                ))}
              </div>
              {booking.adminNotes && (
                <div style={{ marginTop:16, background:'rgba(212,160,41,0.08)', borderRadius:'var(--radius-sm)', padding:12 }}>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:4 }}>Note from admin:</div>
                  <div style={{ fontSize:'0.875rem' }}>{booking.adminNotes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
