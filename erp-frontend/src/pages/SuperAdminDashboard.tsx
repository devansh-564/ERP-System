import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { getDashboardStats, getAllTenants, createTenant, deleteTenant } from '../services/api.ts';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    companyName: '', email: '', phone: '', plan: 'basic'
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [statsRes, tenantsRes] = await Promise.all([
        getDashboardStats(),
        getAllTenants()
      ]);
      setStats(statsRes.data.stats);
      setTenants(tenantsRes.data.tenants);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTenant(form);
      setForm({ companyName: '', email: '', phone: '', plan: 'basic' });
      setShowForm(false);
      fetchData();
      alert('✅ Tenant created successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating tenant');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"?`)) {
      try {
        await deleteTenant(id);
        fetchData();
      } catch (err) {
        alert('Error deleting tenant');
      }
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontSize: '18px' }}>Loading...</div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .dashboard-root {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          color: white;
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          left: 0; top: 0; bottom: 0;
          width: 240px;
          background: #0f0f1a;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          z-index: 100;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 24px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          padding: 24px 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.25);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 0 12px;
          margin-bottom: 8px;
          margin-top: 16px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          transition: all 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.8);
        }

        .nav-item.active {
          background: rgba(99,102,241,0.15);
          color: #a78bfa;
          border: 1px solid rgba(99,102,241,0.2);
        }

        .nav-icon { font-size: 16px; }

        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.03);
          margin-bottom: 8px;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 13px;
          font-weight: 500;
          color: white;
        }

        .user-role {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          color: rgba(239,68,68,0.7);
          transition: all 0.2s;
          border: none;
          background: none;
          width: 100%;
        }

        .logout-btn:hover {
          background: rgba(239,68,68,0.08);
          color: #f87171;
        }

        /* Main Content */
        .main {
          margin-left: 240px;
          min-height: 100vh;
        }

        .topbar {
          padding: 20px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15,15,26,0.8);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .page-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
        }

        .page-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .create-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 8px;
          color: white;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .create-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.4);
        }

        .content {
          padding: 32px 40px;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #0f0f1a;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .stat-card:hover {
          border-color: rgba(255,255,255,0.12);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
        }

        .stat-card:nth-child(1)::before { background: linear-gradient(90deg, #6366f1, #8b5cf6); }
        .stat-card:nth-child(2)::before { background: linear-gradient(90deg, #10b981, #34d399); }
        .stat-card:nth-child(3)::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .stat-card:nth-child(4)::before { background: linear-gradient(90deg, #ef4444, #f87171); }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          margin-bottom: 16px;
        }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: white;
          letter-spacing: -1px;
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }

        .stat-change {
          position: absolute;
          top: 24px;
          right: 24px;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 20px;
          font-weight: 600;
        }

        /* Tenants Table */
        .table-section {
          background: #0f0f1a;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
        }

        .table-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: white;
        }

        .table-count {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }

        .table-head {
          display: grid;
          grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1.5fr;
          padding: 12px 24px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1.5fr;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          align-items: center;
          font-size: 14px;
          transition: background 0.15s;
        }

        .table-row:hover {
          background: rgba(255,255,255,0.02);
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .company-name {
          font-weight: 600;
          color: white;
          font-size: 14px;
        }

        .company-email {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }

        .plan-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          display: inline-block;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 6px;
        }

        .action-btns {
          display: flex;
          gap: 8px;
        }

        .manage-btn {
          padding: 6px 14px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 6px;
          color: #a78bfa;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .manage-btn:hover {
          background: rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.4);
        }

        .delete-btn {
          padding: 6px 14px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.15);
          border-radius: 6px;
          color: #f87171;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.3);
        }

        .empty-state {
          padding: 60px;
          text-align: center;
          color: rgba(255,255,255,0.25);
          font-size: 14px;
        }

        .empty-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        .modal {
          background: #0f0f1a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 32px;
          width: 100%;
          max-width: 480px;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }

        .modal-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 28px;
        }

        .modal-field {
          margin-bottom: 16px;
        }

        .modal-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .modal-input {
          width: 100%;
          padding: 12px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: white;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s;
        }

        .modal-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.05);
        }

        .modal-input::placeholder { color: rgba(255,255,255,0.2); }

        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .modal-cancel {
          flex: 1;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-cancel:hover { background: rgba(255,255,255,0.08); }

        .modal-submit {
          flex: 2;
          padding: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 10px;
          color: white;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-submit:hover {
          box-shadow: 0 6px 20px rgba(99,102,241,0.4);
        }
      `}</style>

      <div className="dashboard-root">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-icon">🏢</div>
            <span className="brand-name">NexERP</span>
          </div>

          <div className="sidebar-nav">
            <div className="nav-label">Main</div>
            <button className="nav-item active">
              <span className="nav-icon">📊</span> Dashboard
            </button>
            <button className="nav-item">
              <span className="nav-icon">🏢</span> Tenants
            </button>
            <button className="nav-item">
              <span className="nav-icon">👥</span> Users
            </button>

            <div className="nav-label">System</div>
            <button className="nav-item">
              <span className="nav-icon">⚙️</span> Settings
            </button>
            <button className="nav-item">
              <span className="nav-icon">📈</span> Analytics
            </button>
          </div>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">👑</div>
              <div>
                <div className="user-name">{user?.name}</div>
                <div className="user-role">Super Admin</div>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              🚪 Sign out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main">
          <div className="topbar">
            <div>
              <div className="page-title">Dashboard Overview</div>
              <div className="page-subtitle">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="topbar-actions">
              <button className="create-btn" onClick={() => setShowForm(true)}>
                + Create New ERP
              </button>
            </div>
          </div>

          <div className="content">
            {/* Stats */}
            <div className="stats-grid">
              {[
                { icon: '🏢', label: 'Total ERPs', value: stats?.totalTenants ?? 0, bg: 'rgba(99,102,241,0.1)', change: 'All time', changeColor: '#a78bfa' },
                { icon: '✅', label: 'Active ERPs', value: stats?.activeTenants ?? 0, bg: 'rgba(16,185,129,0.1)', change: 'Running', changeColor: '#34d399' },
                { icon: '👥', label: 'Total Users', value: stats?.totalUsers ?? 0, bg: 'rgba(245,158,11,0.1)', change: 'Across all', changeColor: '#fbbf24' },
                { icon: '⏸️', label: 'Inactive ERPs', value: stats?.inactiveTenants ?? 0, bg: 'rgba(239,68,68,0.1)', change: 'Paused', changeColor: '#f87171' },
              ].map((stat, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-icon" style={{ background: stat.bg }}>{stat.icon}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-change" style={{ background: stat.bg, color: stat.changeColor }}>
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Tenants Table */}
            <div className="table-section">
              <div className="table-header">
                <div>
                  <div className="table-title">ERP Tenants</div>
                  <div className="table-count">{tenants.length} companies registered</div>
                </div>
              </div>

              <div className="table-head">
                <span>Company</span>
                <span>Email</span>
                <span>Plan</span>
                <span>Status</span>
                <span>Created</span>
                <span>Actions</span>
              </div>

              {tenants.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏢</div>
                  <div>No tenants yet. Create your first ERP!</div>
                </div>
              ) : (
                tenants.map(tenant => (
                  <div className="table-row" key={tenant._id}>
                    <div>
                      <div className="company-name">{tenant.companyName}</div>
                      <div className="company-email">{tenant.phone || 'No phone'}</div>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{tenant.email}</div>
                    <div>
                      <span className="plan-badge" style={{
                        background: tenant.plan === 'enterprise' ? 'rgba(99,102,241,0.15)' :
                          tenant.plan === 'pro' ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)',
                        color: tenant.plan === 'enterprise' ? '#a78bfa' :
                          tenant.plan === 'pro' ? '#34d399' : '#9ca3af'
                      }}>
                        {tenant.plan}
                      </span>
                    </div>
                    <div>
                      <span className="status-dot" style={{ background: tenant.status === 'active' ? '#10b981' : '#ef4444' }} />
                      <span style={{ color: tenant.status === 'active' ? '#34d399' : '#f87171', fontSize: '13px' }}>
                        {tenant.status}
                      </span>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                      {new Date(tenant.createdAt).toLocaleDateString('en-IN')}
                    </div>
                    <div className="action-btns">
                      <button className="manage-btn"
                        onClick={() => window.location.href = `/tenant-details/${tenant._id}`}>
                        Manage
                      </button>
                      <button className="delete-btn"
                        onClick={() => handleDelete(tenant._id, tenant.companyName)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Create Tenant Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Create New ERP</div>
              <div className="modal-subtitle">Add a new company to the platform</div>

              <form onSubmit={handleCreate}>
                <div className="modal-grid">
                  <div className="modal-field">
                    <label className="modal-label">Company Name</label>
                    <input className="modal-input" placeholder="Acme Corp"
                      value={form.companyName}
                      onChange={e => setForm({ ...form, companyName: e.target.value })}
                      required />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Company Email</label>
                    <input className="modal-input" placeholder="admin@acme.com" type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Phone</label>
                    <input className="modal-input" placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Plan</label>
                    <select className="modal-input"
                      value={form.plan}
                      onChange={e => setForm({ ...form, plan: e.target.value })}>
                      <option value="basic">Basic</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="modal-cancel" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="modal-submit">
                    Create ERP Tenant →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SuperAdminDashboard;