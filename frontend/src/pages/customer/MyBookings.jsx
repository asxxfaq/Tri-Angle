import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const statusColors = { pending:'badge-pending', confirmed:'badge-confirmed', completed:'badge-completed', cancelled:'badge-cancelled', 'in-progress':'badge-in-progress' };

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const { data } = await api.get('/bookings', { params });
      setBookings(data.bookings);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}`, {});
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to cancel'); }
  };

  return (
    <div style={{ minHeight:'100vh' }}>
      <Navbar />
      <div style={{ paddingTop:100, paddingBottom:80 }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:40, flexWrap:'wrap', gap:16 }}>
            <div>
              <h1 style={{ fontSize:'2rem', marginBottom:4 }}>My <span className="gradient-text">Bookings</span></h1>
              <p style={{ color:'var(--text-secondary)' }}>Track all your catering booking requests</p>
            </div>
            <Link to="/book" className="btn btn-primary">+ New Booking</Link>
          </div>

          {/* Status Filters */}
          <div style={{ display:'flex', gap:8, marginBottom:32, flexWrap:'wrap' }}>
            {['', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}>
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-screen" style={{ minHeight:300 }}><div className="spinner" /></div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>📋</div>
              <h3 style={{ marginBottom:8 }}>No bookings found</h3>
              <p style={{ color:'var(--text-secondary)', marginBottom:24 }}>Start by booking catering staff for your event</p>
              <Link to="/book" className="btn btn-primary">Book Now →</Link>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {bookings.map(b => (
                <div key={b._id} className="card" style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'center' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8, flexWrap:'wrap' }}>
                      <span style={{ fontSize:'1.5rem' }}>{b.eventType?.icon || '🎉'}</span>
                      <h3 style={{ fontSize:'1.1rem' }}>{b.eventName}</h3>
                      <span className={`badge ${statusColors[b.status]}`}>{b.status}</span>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                      <div>
                        <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:2 }}>EVENT TYPE</div>
                        <div style={{ fontWeight:500, fontSize:'0.9rem' }}>{b.eventType?.name}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:2 }}>DATE</div>
                        <div style={{ fontWeight:500, fontSize:'0.9rem' }}>{b.eventDate ? format(new Date(b.eventDate), 'dd MMM yyyy') : '-'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:2 }}>VENUE</div>
                        <div style={{ fontWeight:500, fontSize:'0.9rem' }}>{b.venueName}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:2 }}>STAFF NEEDED</div>
                        <div style={{ fontWeight:500, fontSize:'0.9rem' }}>{b.numberOfStaff} persons</div>
                      </div>
                      <div>
                        <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:2 }}>AMOUNT</div>
                        <div style={{ fontWeight:500, fontSize:'0.9rem', color:'var(--gold)' }}>₹{b.totalAmount?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:2 }}>BOOKED ON</div>
                        <div style={{ fontWeight:500, fontSize:'0.9rem' }}>{format(new Date(b.createdAt), 'dd MMM yyyy')}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8, minWidth:120 }}>
                    <Link to={`/my-bookings/${b._id}`} className="btn btn-outline btn-sm">View Details</Link>
                    {b.status === 'pending' && (
                      <button onClick={() => cancelBooking(b._id)} className="btn btn-danger btn-sm">Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
