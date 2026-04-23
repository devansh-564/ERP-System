import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TenantDetails = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'employee', tenantId
  });

  const token = localStorage.getItem('token');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tenant/users/${tenantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tenant/users',
        { ...form, tenantId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ name: '', email: '', password: '', role: 'employee', tenantId });
      setShowForm(false);
      fetchUsers();
      alert('✅ User created!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating user');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tenant/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (err) { alert('Error deleting user'); }
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/admin')} style={styles.backBtn}>← Back</button>
          <div>
            <h1 style={styles.headerTitle}>👥 Tenant Users</h1>
            <p style={styles.headerSub}>Manage users for this ERP</p>
          </div>
        </div>
        <button onClick={() => navigate(`/inventory/${tenantId}`)} style={styles.inventoryBtn}>
          📦 View Inventory
        </button>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Users ({users.length})</h2>
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? '✕ Cancel' : '+ Add User'}
          </button>
        </div>

        {showForm && (
          <div style={styles.form}>
            <h3 style={{ marginBottom: '16px' }}>Add New User</h3>
            <form onSubmit={handleCreate}>
              <div style={styles.formGrid}>
                <input placeholder="Full Name *" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={styles.input} required />
                <input placeholder="Email *" type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={styles.input} required />
                <input placeholder="Password *" type="password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={styles.input} required />
                <select value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  style={styles.input}>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
              <button type="submit" style={styles.submitBtn}>Create User</button>
            </form>
          </div>
        )}

        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {users.length === 0 ? (
            <div style={styles.empty}>No users yet. Add your first user! 👤</div>
          ) : (
            users.map(user => (
              <div key={user._id} style={styles.tableRow}>
                <span style={styles.userName}>{user.name}</span>
                <span>{user.email}</span>
                <span>
                  <span style={{
                    ...styles.badge,
                    background: user.role === 'admin' ? '#6366f1' :
                      user.role === 'manager' ? '#f59e0b' : '#6b7280'
                  }}>
                    {user.role}
                  </span>
                </span>
                <span>
                  <span style={{ ...styles.badge, background: '#10b981' }}>active</span>
                </span>
                <span>
                  <button onClick={() => handleDelete(user._id)} style={styles.deleteBtn}>
                    Delete
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Arial, sans-serif' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  header: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: 'white', margin: 0, fontSize: '24px' },
  headerSub: { color: 'rgba(255,255,255,0.8)', margin: '4px 0 0 0', fontSize: '14px' },
  backBtn: { background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  inventoryBtn: { background: 'white', color: '#6366f1', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  section: { margin: '30px 40px', background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  sectionTitle: { margin: 0, fontSize: '20px', color: '#1f2937' },
  addBtn: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  form: { background: '#f8fafc', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  input: { padding: '10px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  submitBtn: { background: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  table: { border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '12px 20px', background: '#f8fafc', fontWeight: 'bold', fontSize: '13px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '14px' },
  userName: { fontWeight: '600', color: '#1f2937' },
  badge: { color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  deleteBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
  empty: { padding: '40px', textAlign: 'center', color: '#6b7280' },
};

export default TenantDetails;