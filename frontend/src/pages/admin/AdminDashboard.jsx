import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookingStats, setBookingStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/bookings/stats'),
    ]).then(([d, b]) => {
      setStats(d.data);
      setBookingStats(b.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const chartData = bookingStats?.monthlyBookings?.map(m => ({
    month: months[(m._id.month || 1) - 1],
    bookings: m.count,
  })) || [];

  const statusColors = { pending:'badge-pending', confirmed:'badge-confirmed', completed:'badge-completed', cancelled:'badge-cancelled', 'in-progress':'badge-in-progress' };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Dashboard</h1>
          <p className="admin-subtitle">Welcome back! Here's what's happening with TRI-ANGLE Catering.</p>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height:300 }}><div className="spinner" /></div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid-4" style={{ marginBottom:32 }}>
              {[
                { icon:'📋', label:'Total Bookings', value: stats?.totalBookings || 0, color:'var(--gold)' },
                { icon:'⏳', label:'Pending', value: stats?.pendingBookings || 0, color:'var(--warning)' },
                { icon:'👥', label:'Total Staff', value: stats?.totalStaff || 0, color:'#3b82f6' },
                { icon:'👤', label:'Customers', value: stats?.totalCustomers || 0, color:'var(--success)' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-icon">{s.icon}</div>
                  <div>
                    <div className="stat-value" style={{ color:s.color }}>{s.value.toLocaleString()}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid-2" style={{ marginBottom:32 }}>
              {/* Revenue Card */}
              <div className="card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                  <h3>Revenue Overview</h3>
                  <span className="badge badge-confirmed">Active</span>
                </div>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:'2.5rem', color:'var(--gold)', marginBottom:8 }}>
                  ₹{(stats?.revenue || 0).toLocaleString()}
                </div>
                <div style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>Total from confirmed & completed bookings</div>
                <div style={{ marginTop:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  {[
                    ['Confirmed', bookingStats?.confirmed || 0, 'var(--success)'],
                    ['Completed', bookingStats?.completed || 0, '#3b82f6'],
                    ['Pending', bookingStats?.pending || 0, 'var(--warning)'],
                    ['Cancelled', bookingStats?.cancelled || 0, 'var(--error)'],
                  ].map(([l,v,c]) => (
                    <div key={l} style={{ background:'var(--bg-secondary)', borderRadius:'var(--radius-sm)', padding:12 }}>
                      <div style={{ fontSize:'1.2rem', fontWeight:700, color:c }}>{v}</div>
                      <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Chart */}
              <div className="card">
                <h3 style={{ marginBottom:20 }}>Monthly Bookings</h3>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="month" tick={{ fill:'#94a3b8', fontSize:12 }} />
                      <YAxis tick={{ fill:'#94a3b8', fontSize:12 }} />
                      <Tooltip
                        contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8, color:'#fff' }}
                      />
                      <Bar dataKey="bookings" fill="#d4a029" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex-center" style={{ height:200, color:'var(--text-secondary)' }}>No data yet</div>
                )}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <h3>Recent Bookings</h3>
                <Link to="/admin/bookings" className="btn btn-outline btn-sm">View All</Link>
              </div>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Staff</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentBookings?.map(b => (
                      <tr key={b._id}>
                        <td>{b.customer?.name || '-'}</td>
                        <td style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <span>{b.eventType?.icon}</span> {b.eventType?.name}
                        </td>
                        <td>{b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-IN') : '-'}</td>
                        <td>{b.numberOfStaff} persons</td>
                        <td><span className={`badge ${statusColors[b.status]}`}>{b.status}</span></td>
                      </tr>
                    )) || (
                      <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text-secondary)', padding:40 }}>No bookings yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
