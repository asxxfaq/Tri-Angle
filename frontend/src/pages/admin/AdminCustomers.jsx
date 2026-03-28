import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = { limit:100 };
      if (search) params.search = search;
      const { data } = await api.get('/admin/customers', { params });
      setCustomers(data.users);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchCustomers(); }, [search]);

  const toggleStatus = async (id) => {
    try {
      const { data } = await api.put(`/admin/customers/${id}/toggle`);
      toast.success(data.message);
      fetchCustomers();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Customer Management</h1>
          <p className="admin-subtitle">All registered customers on TRI-ANGLE platform</p>
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:24 }}>
          <input className="form-input" style={{ maxWidth:300 }} placeholder="🔍 Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign:'center', padding:40 }}><div className="spinner" style={{ margin:'0 auto' }} /></td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text-secondary)', padding:40 }}>No customers found</td></tr>
                ) : customers.map(c => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg, var(--gold-dark), var(--gold))', display:'flex', alignItems:'center', justifyContent:'center', color:'#070b14', fontWeight:700, fontSize:'0.875rem' }}>
                          {c.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight:600 }}>{c.name}</div>
                          <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize:'0.875rem' }}>{c.phone}</td>
                    <td style={{ fontSize:'0.875rem', color:'var(--text-secondary)', maxWidth:200 }}>{c.address || '-'}</td>
                    <td style={{ fontSize:'0.875rem' }}>{format(new Date(c.createdAt), 'dd MMM yyyy')}</td>
                    <td>
                      <span className={`badge ${c.isActive ? 'badge-active' : 'badge-inactive'}`}>
                        {c.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => toggleStatus(c._id)}
                        className={`btn btn-sm ${c.isActive ? 'btn-danger' : 'btn-success'}`}>
                        {c.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCustomers;
