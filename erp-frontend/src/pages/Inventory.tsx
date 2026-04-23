import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inventory = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '', description: '', category: '',
    quantity: 0, price: 0, unit: 'pcs'
  });

  const token = localStorage.getItem('token');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, statsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/inventory/${tenantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/inventory/${tenantId}/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setItems(itemsRes.data.items);
      setStats(statsRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/inventory/${tenantId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ name: '', description: '', category: '', quantity: 0, price: 0, unit: 'pcs' });
      setShowForm(false);
      fetchData();
      alert('✅ Item added!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error adding item');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/inventory/${tenantId}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) { alert('Error deleting item'); }
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'in-stock') return '#10b981';
    if (status === 'low-stock') return '#f59e0b';
    return '#ef4444';
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate(`/tenant-details/${tenantId}`)}
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
            ← Back
          </button>
          <div>
            <h1 style={{ color: 'white', margin: 0 }}>📦 Inventory</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0 0', fontSize: '14px' }}>Manage products & stock</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', padding: '30px 40px 0' }}>
          {[
            { label: 'Total Items', value: stats.totalItems, color: '#6366f1' },
            { label: 'In Stock', value: stats.inStock, color: '#10b981' },
            { label: 'Low Stock', value: stats.lowStock, color: '#f59e0b' },
            { label: 'Out of Stock', value: stats.outOfStock, color: '#ef4444' },
            { label: 'Total Value', value: `₹${stats.totalValue?.toLocaleString()}`, color: '#8b5cf6' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color, margin: '0 0 8px 0' }}>{stat.value}</h3>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '13px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Inventory Table */}
      <div style={{ margin: '30px 40px', background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0 }}>All Products</h2>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {showForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ marginBottom: '16px' }}>Add New Product</h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <input placeholder="Product Name *" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} required />
                <input placeholder="Category *" value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} required />
                <input placeholder="Description" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
                <input placeholder="Quantity *" type="number" value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                  style={{ padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} required />
                <input placeholder="Price (₹) *" type="number" value={form.price}
                  onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                  style={{ padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} required />
                <select value={form.unit}
                  onChange={e => setForm({ ...form, unit: e.target.value })}
                  style={{ padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}>
                  <option value="pcs">Pieces</option>
                  <option value="kg">Kg</option>
                  <option value="ltr">Liters</option>
                  <option value="box">Box</option>
                </select>
              </div>
              <button type="submit"
                style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Add Product
              </button>
            </form>
          </div>
        )}

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '12px 20px', background: '#f8fafc', fontWeight: 'bold', fontSize: '13px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
            <span>Product</span><span>Category</span><span>Quantity</span><span>Price</span><span>Status</span><span>Actions</span>
          </div>
          {items.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No products yet. Add your first product! 📦</div>
          ) : (
            items.map(item => (
              <div key={item._id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '14px' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.description}</div>
                </div>
                <span>{item.category}</span>
                <span>{item.quantity} {item.unit}</span>
                <span>₹{item.price}</span>
                <span>
                  <span style={{ background: getStatusColor(item.status), color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {item.status}
                  </span>
                </span>
                <span>
                  <button onClick={() => handleDelete(item._id)}
                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
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

export default Inventory;