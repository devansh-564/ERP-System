import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import axios from 'axios';

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [itemForm, setItemForm] = useState({ name: '', description: '', category: '', quantity: 0, price: 0, unit: 'pcs' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (user?.tenantId) fetchData();
    else setLoading(false);
  }, [user]);

  const fetchData = async () => {
    try {
      const [itemsRes, statsRes, teamRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/inventory/${user?.tenantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/inventory/${user?.tenantId}/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/tenant/users/${user?.tenantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setInventory(itemsRes.data.items);
      setStats(statsRes.data);
      setTeam(teamRes.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tenant/users',
        { ...userForm, tenantId: user?.tenantId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserForm({ name: '', email: '', password: '', role: 'employee' });
      setShowAddUser(false);
      fetchData();
      alert('✅ Team member added!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error adding user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Remove this team member?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tenant/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) { alert('Error removing user'); }
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/inventory/${user?.tenantId}`,
        itemForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItemForm({ name: '', description: '', category: '', quantity: 0, price: 0, unit: 'pcs' });
      setShowAddItem(false);
      fetchData();
      alert('✅ Item added!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error adding item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/inventory/${user?.tenantId}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) { alert('Error deleting item'); }
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === 'in-stock') return { bg: 'rgba(16,185,129,0.15)', color: '#34d399' };
    if (status === 'low-stock') return { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' };
    return { bg: 'rgba(239,68,68,0.15)', color: '#f87171' };
  };

  const getRoleStyle = (role: string) => {
    if (role === 'admin') return { bg: 'rgba(99,102,241,0.15)', color: '#a78bfa' };
    if (role === 'manager') return { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' };
    return { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' };
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontSize: '18px' }}>Loading...</div>
    </div>
  );

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .t-root { min-height: 100vh; background: #0a0a0f; font-family: 'DM Sans', sans-serif; color: white; }
        .t-sidebar { position: fixed; left: 0; top: 0; bottom: 0; width: 240px; background: #0f0f1a; border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; padding: 24px 0; z-index: 100; }
        .t-brand { display: flex; align-items: center; gap: 12px; padding: 0 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .t-brand-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .t-brand-name { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: white; }
        .t-company { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 1px; }
        .t-nav { padding: 24px 12px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .t-nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.25); letter-spacing: 1.5px; text-transform: uppercase; padding: 0 12px; margin-bottom: 8px; margin-top: 16px; }
        .t-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; font-size: 14px; color: rgba(255,255,255,0.5); transition: all 0.2s; border: none; background: none; width: 100%; text-align: left; }
        .t-nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
        .t-nav-item.active { background: rgba(16,185,129,0.12); color: #34d399; border: 1px solid rgba(16,185,129,0.2); }
        .t-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }
        .t-user { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 8px; }
        .t-avatar { width: 32px; height: 32px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
        .t-logout { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; color: rgba(239,68,68,0.7); transition: all 0.2s; border: none; background: none; width: 100%; }
        .t-logout:hover { background: rgba(239,68,68,0.08); color: #f87171; }
        .t-main { margin-left: 240px; min-height: 100vh; }
        .t-topbar { padding: 20px 40px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; background: rgba(15,15,26,0.8); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 50; }
        .t-page-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: white; letter-spacing: -0.5px; }
        .t-page-sub { font-size: 13px; color: rgba(255,255,255,0.35); margin-top: 2px; }
        .t-content { padding: 32px 40px; }
        .welcome-banner { background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08)); border: 1px solid rgba(16,185,129,0.2); border-radius: 16px; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; position: relative; overflow: hidden; }
        .welcome-banner::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent); }
        .welcome-text { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: white; }
        .welcome-sub { font-size: 13px; color: rgba(255,255,255,0.45); margin-top: 4px; }
        .t-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 28px; }
        .t-stat { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 20px; position: relative; overflow: hidden; transition: border-color 0.2s; }
        .t-stat:hover { border-color: rgba(255,255,255,0.12); }
        .t-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
        .t-stat:nth-child(1)::before { background: linear-gradient(90deg, #6366f1, #8b5cf6); }
        .t-stat:nth-child(2)::before { background: linear-gradient(90deg, #10b981, #34d399); }
        .t-stat:nth-child(3)::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .t-stat:nth-child(4)::before { background: linear-gradient(90deg, #ef4444, #f87171); }
        .t-stat:nth-child(5)::before { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }
        .t-stat-val { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: white; letter-spacing: -1px; line-height: 1; margin-bottom: 6px; }
        .t-stat-label { font-size: 12px; color: rgba(255,255,255,0.4); }
        .t-section { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; margin-bottom: 24px; }
        .t-section-hdr { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; }
        .t-section-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: white; }
        .t-section-count { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 2px; }
        .t-add-btn { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 8px; color: white; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .t-add-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(16,185,129,0.3); }
        .t-col-hdr { display: grid; padding: 12px 24px; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1px; text-transform: uppercase; }
        .t-row { display: grid; padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.03); align-items: center; font-size: 14px; transition: background 0.15s; }
        .t-row:hover { background: rgba(255,255,255,0.02); }
        .t-row:last-child { border-bottom: none; }
        .t-badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.3px; display: inline-block; }
        .t-del-btn { padding: 5px 12px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); border-radius: 6px; color: #f87171; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .t-del-btn:hover { background: rgba(239,68,68,0.15); }
        .t-empty { padding: 50px; text-align: center; color: rgba(255,255,255,0.25); font-size: 14px; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: #0f0f1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; width: 100%; max-width: 460px; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .modal-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: white; margin-bottom: 4px; }
        .modal-sub { font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 24px; }
        .modal-field { margin-bottom: 14px; }
        .modal-label { display: block; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.4); letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 6px; }
        .modal-input { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: white; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; }
        .modal-input:focus { border-color: rgba(16,185,129,0.5); background: rgba(16,185,129,0.05); }
        .modal-input::placeholder { color: rgba(255,255,255,0.2); }
        .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .modal-actions { display: flex; gap: 12px; margin-top: 20px; }
        .modal-cancel { flex: 1; padding: 11px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: rgba(255,255,255,0.6); font-size: 14px; cursor: pointer; }
        .modal-submit { flex: 2; padding: 11px; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 10px; color: white; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .modal-submit:hover { box-shadow: 0 6px 20px rgba(16,185,129,0.3); }
        .role-pill { padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
      `}</style>

      <div className="t-root">
        {/* Sidebar */}
        <div className="t-sidebar">
          <div className="t-brand">
            <div className="t-brand-icon">🏢</div>
            <div>
              <div className="t-brand-name">NexERP</div>
              <div className="t-company">{user?.companyName}</div>
            </div>
          </div>
          <div className="t-nav">
            <div className="t-nav-label">Workspace</div>
            <button className={`t-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveNav('dashboard')}><span>📊</span> Dashboard</button>
            <button className={`t-nav-item ${activeNav === 'inventory' ? 'active' : ''}`} onClick={() => setActiveNav('inventory')}><span>📦</span> Inventory</button>
            {isAdmin && <button className={`t-nav-item ${activeNav === 'team' ? 'active' : ''}`} onClick={() => setActiveNav('team')}><span>👥</span> Team</button>}
            <div className="t-nav-label">Reports</div>
            <button className="t-nav-item"><span>📈</span> Analytics</button>
            <button className="t-nav-item"><span>📋</span> Reports</button>
          </div>
          <div className="t-footer">
            <div className="t-user">
              <div className="t-avatar">👤</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'white' }}>{user?.name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{user?.role}</div>
              </div>
            </div>
            <button className="t-logout" onClick={logout}>🚪 Sign out</button>
          </div>
        </div>

        {/* Main */}
        <div className="t-main">
          <div className="t-topbar">
            <div>
              <div className="t-page-title">
                {activeNav === 'dashboard' ? 'Dashboard Overview' : activeNav === 'inventory' ? 'Inventory Management' : 'Team Management'}
              </div>
              <div className="t-page-sub">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {activeNav === 'inventory' && isAdmin && (
                <button className="t-add-btn" onClick={() => setShowAddItem(true)}>+ Add Product</button>
              )}
              {activeNav === 'team' && isAdmin && (
                <button className="t-add-btn" onClick={() => setShowAddUser(true)}>+ Add Member</button>
              )}
              <span className="role-pill" style={{ background: getRoleStyle(user?.role || '').bg, color: getRoleStyle(user?.role || '').color }}>
                {user?.role}
              </span>
            </div>
          </div>

          <div className="t-content">
            {/* DASHBOARD VIEW */}
            {activeNav === 'dashboard' && (
              <>
                <div className="welcome-banner">
                  <div>
                    <div className="welcome-text">Welcome back, {user?.name}! 👋</div>
                    <div className="welcome-sub">{user?.companyName} · Here's your business overview</div>
                  </div>
                  <div style={{ fontSize: '48px' }}>🏢</div>
                </div>

                {stats && (
                  <div className="t-stats">
                    {[
                      { label: 'Total Items', value: stats.totalItems, icon: '📦' },
                      { label: 'In Stock', value: stats.inStock, icon: '✅' },
                      { label: 'Low Stock', value: stats.lowStock, icon: '⚠️' },
                      { label: 'Out of Stock', value: stats.outOfStock, icon: '❌' },
                      { label: 'Total Value', value: `₹${(stats.totalValue || 0).toLocaleString()}`, icon: '💰' },
                    ].map((s, i) => (
                      <div className="t-stat" key={i}>
                        <div style={{ fontSize: '24px', marginBottom: '12px' }}>{s.icon}</div>
                        <div className="t-stat-val">{s.value}</div>
                        <div className="t-stat-label">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Quick Inventory */}
                  <div className="t-section">
                    <div className="t-section-hdr">
                      <div>
                        <div className="t-section-title">📦 Recent Inventory</div>
                        <div className="t-section-count">{inventory.length} products</div>
                      </div>
                      <button className="t-add-btn" style={{ fontSize: '11px', padding: '6px 12px' }} onClick={() => setActiveNav('inventory')}>View All</button>
                    </div>
                    {inventory.slice(0, 4).map(item => {
                      const s = getStatusStyle(item.status);
                      return (
                        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.name}</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{item.category}</div>
                          </div>
                          <span className="t-badge" style={{ background: s.bg, color: s.color }}>{item.status}</span>
                        </div>
                      );
                    })}
                    {inventory.length === 0 && <div className="t-empty">No inventory yet</div>}
                  </div>

                  {/* Quick Team */}
                  <div className="t-section">
                    <div className="t-section-hdr">
                      <div>
                        <div className="t-section-title">👥 Team Members</div>
                        <div className="t-section-count">{team.length} members</div>
                      </div>
                      {isAdmin && <button className="t-add-btn" style={{ fontSize: '11px', padding: '6px 12px' }} onClick={() => setActiveNav('team')}>Manage</button>}
                    </div>
                    {team.slice(0, 4).map(member => {
                      const r = getRoleStyle(member.role);
                      return (
                        <div key={member._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', background: r.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>👤</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '14px' }}>{member.name}</div>
                              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{member.email}</div>
                            </div>
                          </div>
                          <span className="t-badge" style={{ background: r.bg, color: r.color }}>{member.role}</span>
                        </div>
                      );
                    })}
                    {team.length === 0 && <div className="t-empty">No team members yet</div>}
                  </div>
                </div>
              </>
            )}

            {/* INVENTORY VIEW */}
            {activeNav === 'inventory' && (
              <div className="t-section">
                <div className="t-section-hdr">
                  <div>
                    <div className="t-section-title">📦 All Products</div>
                    <div className="t-section-count">{inventory.length} items</div>
                  </div>
                </div>
                <div className="t-col-hdr" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
                  <span>Product</span><span>Category</span><span>Quantity</span><span>Price</span><span>Status</span>
                </div>
                {inventory.length === 0 ? (
                  <div className="t-empty">No products yet. Add your first product!</div>
                ) : (
                  inventory.map(item => {
                    const s = getStatusStyle(item.status);
                    return (
                      <div className="t-row" key={item._id} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{item.description}</div>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{item.category}</span>
                        <span style={{ fontWeight: 600 }}>{item.quantity} <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontWeight: 400 }}>{item.unit}</span></span>
                        <span style={{ color: '#34d399', fontWeight: 600 }}>₹{item.price.toLocaleString()}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="t-badge" style={{ background: s.bg, color: s.color }}>{item.status}</span>
                          {isAdmin && <button className="t-del-btn" onClick={() => handleDeleteItem(item._id)}>Delete</button>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TEAM VIEW */}
            {activeNav === 'team' && isAdmin && (
              <div className="t-section">
                <div className="t-section-hdr">
                  <div>
                    <div className="t-section-title">👥 Team Members</div>
                    <div className="t-section-count">{team.length} members</div>
                  </div>
                </div>
                <div className="t-col-hdr" style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr' }}>
                  <span>Name</span><span>Email</span><span>Role</span><span>Actions</span>
                </div>
                {team.length === 0 ? (
                  <div className="t-empty">No team members yet. Add your first member!</div>
                ) : (
                  team.map(member => {
                    const r = getRoleStyle(member.role);
                    return (
                      <div className="t-row" key={member._id} style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', background: r.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                          <span style={{ fontWeight: 600 }}>{member.name}</span>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{member.email}</span>
                        <span className="t-badge" style={{ background: r.bg, color: r.color }}>{member.role}</span>
                        <button className="t-del-btn" onClick={() => handleDeleteUser(member._id)}>Remove</button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add User Modal */}
        {showAddUser && (
          <div className="modal-overlay" onClick={() => setShowAddUser(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Add Team Member</div>
              <div className="modal-sub">Add a new member to {user?.companyName}</div>
              <form onSubmit={handleAddUser}>
                <div className="modal-grid">
                  <div className="modal-field">
                    <label className="modal-label">Full Name</label>
                    <input className="modal-input" placeholder="John Doe" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Email</label>
                    <input className="modal-input" placeholder="john@company.com" type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Password</label>
                    <input className="modal-input" placeholder="••••••••" type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Role</label>
                    <select className="modal-input" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="modal-cancel" onClick={() => setShowAddUser(false)}>Cancel</button>
                  <button type="submit" className="modal-submit">Add Member →</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddItem && (
          <div className="modal-overlay" onClick={() => setShowAddItem(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Add Product</div>
              <div className="modal-sub">Add a new item to inventory</div>
              <form onSubmit={handleAddItem}>
                <div className="modal-grid">
                  <div className="modal-field">
                    <label className="modal-label">Product Name</label>
                    <input className="modal-input" placeholder="Laptop" value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} required />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Category</label>
                    <input className="modal-input" placeholder="Electronics" value={itemForm.category} onChange={e => setItemForm({ ...itemForm, category: e.target.value })} required />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Quantity</label>
                    <input className="modal-input" type="number" placeholder="50" value={itemForm.quantity} onChange={e => setItemForm({ ...itemForm, quantity: Number(e.target.value) })} required />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Price (₹)</label>
                    <input className="modal-input" type="number" placeholder="45000" value={itemForm.price} onChange={e => setItemForm({ ...itemForm, price: Number(e.target.value) })} required />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Unit</label>
                    <select className="modal-input" value={itemForm.unit} onChange={e => setItemForm({ ...itemForm, unit: e.target.value })}>
                      <option value="pcs">Pieces</option>
                      <option value="kg">Kg</option>
                      <option value="ltr">Liters</option>
                      <option value="box">Box</option>
                    </select>
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Description</label>
                    <input className="modal-input" placeholder="Optional" value={itemForm.description} onChange={e => setItemForm({ ...itemForm, description: e.target.value })} />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="modal-cancel" onClick={() => setShowAddItem(false)}>Cancel</button>
                  <button type="submit" className="modal-submit">Add Product →</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TenantDashboard;