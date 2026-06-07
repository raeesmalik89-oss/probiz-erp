import React, { useEffect, useState } from 'react';
import API from '../api/client';
import toast from 'react-hot-toast';
import { Plus, Search, Edit2, Trash2, Package, AlertTriangle, X } from 'lucide-react';

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 18 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#94a3b8" /></button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#374151' }}>{label}</label>
    <input {...props} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', ...props.style }} />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#374151' }}>{label}</label>
    <select {...props} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', background: '#fff' }}>{children}</select>
  </div>
);

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [form, setForm] = useState({ name: '', sku: '', barcode: '', category_id: '', unit: 'pcs', cost_price: '', sale_price: '', stock: '', min_stock: '10', description: '' });

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (catFilter) params.category_id = catFilter;
      if (lowStockOnly) params.low_stock = true;
      const [pRes, cRes] = await Promise.all([API.get('/api/inventory/products', { params }), API.get('/api/inventory/categories')]);
      setProducts(pRes.data.products);
      setCategories(cRes.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, catFilter, lowStockOnly]);

  const openAdd = () => { setEditProduct(null); setForm({ name: '', sku: '', barcode: '', category_id: '', unit: 'pcs', cost_price: '', sale_price: '', stock: '', min_stock: '10', description: '' }); setShowModal(true); };
  const openEdit = (p) => { setEditProduct(p); setForm({ name: p.name, sku: p.sku || '', barcode: p.barcode || '', category_id: p.category_id || '', unit: p.unit, cost_price: p.cost_price, sale_price: p.sale_price, stock: p.stock, min_stock: p.min_stock, description: '' }); setShowModal(true); };

  const handleSave = async () => {
    try {
      const data = { ...form, category_id: form.category_id || null, cost_price: parseFloat(form.cost_price) || 0, sale_price: parseFloat(form.sale_price) || 0, stock: parseFloat(form.stock) || 0, min_stock: parseFloat(form.min_stock) || 0 };
      if (editProduct) { await API.put(`/api/inventory/products/${editProduct.id}`, data); toast.success('Product updated'); }
      else { await API.post('/api/inventory/products', data); toast.success('Product added'); }
      setShowModal(false); load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error saving product'); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await API.delete(`/api/inventory/products/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Cannot delete'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Inventory</h1>
          <p style={{ color: '#64748b', marginTop: 2 }}>Manage products, categories, and stock levels</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 10, marginBottom: 24, width: 'fit-content' }}>
        {['products', 'categories'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', background: activeTab === tab ? '#fff' : 'transparent', color: activeTab === tab ? '#1e40af' : '#64748b', boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', textTransform: 'capitalize' }}>{tab}</button>
        ))}
      </div>

      {activeTab === 'products' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' }} />
            </div>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff' }}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button onClick={() => setLowStockOnly(!lowStockOnly)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: `1px solid ${lowStockOnly ? '#f59e0b' : '#e2e8f0'}`, borderRadius: 10, background: lowStockOnly ? '#fef3c7' : '#fff', color: lowStockOnly ? '#92400e' : '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              <AlertTriangle size={16} /> Low Stock
            </button>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Product', 'SKU', 'Category', 'Cost', 'Sale Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}><Package size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />No products found</td></tr>
                ) : products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'monospace', fontSize: 12 }}>{p.sku || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>{p.category ? <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.category}</span> : '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>Rs. {p.cost_price?.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#10b981' }}>Rs. {p.sale_price?.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: p.low_stock ? '#ef4444' : '#1e293b' }}>{p.stock} {p.unit}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.low_stock ? <span style={{ background: '#fee2e2', color: '#ef4444', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>LOW STOCK</span>
                        : <span style={{ background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>IN STOCK</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(p)} style={{ padding: '6px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}><Edit2 size={14} color="#3b82f6" /></button>
                        <button onClick={() => handleDelete(p.id, p.name)} style={{ padding: '6px', border: '1px solid #fee2e2', borderRadius: 6, background: '#fff', cursor: 'pointer' }}><Trash2 size={14} color="#ef4444" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'categories' && <CategoriesPanel categories={categories} onRefresh={load} />}

      {showModal && (
        <Modal title={editProduct ? 'Edit Product' : 'Add New Product'} onClose={() => setShowModal(false)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div style={{ gridColumn: '1/-1' }}><Input label="Product Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <Input label="SKU Code" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
            <Input label="Barcode" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} />
            <Select label="Category" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select label="Unit" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
              {['pcs', 'strips', 'box', 'kg', 'g', 'ltr', 'ml', 'pair', 'dozen', 'pack'].map(u => <option key={u}>{u}</option>)}
            </Select>
            <Input label="Cost Price (Rs.)" type="number" value={form.cost_price} onChange={e => setForm({ ...form, cost_price: e.target.value })} />
            <Input label="Sale Price (Rs.)" type="number" value={form.sale_price} onChange={e => setForm({ ...form, sale_price: e.target.value })} />
            <Input label="Opening Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            <Input label="Min Stock Alert" type="number" value={form.min_stock} onChange={e => setForm({ ...form, min_stock: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            <button onClick={handleSave} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Save Product</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function CategoriesPanel({ categories, onRefresh }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const add = async () => {
    if (!name) return;
    try { await API.post('/api/inventory/categories', { name, description: desc }); toast.success('Category added'); setName(''); setDesc(''); onRefresh(); }
    catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
  };

  const del = async (id, n) => {
    if (!window.confirm(`Delete "${n}"?`)) return;
    try { await API.delete(`/api/inventory/categories/${id}`); toast.success('Deleted'); onRefresh(); }
    catch { toast.error('Cannot delete — has products'); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', height: 'fit-content' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Add Category</h3>
        <Input label="Category Name" value={name} onChange={e => setName(e.target.value)} />
        <Input label="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <button onClick={add} style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Add Category</button>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['Name', 'Description', 'Products', ''].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#64748b' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{c.description || '-'}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{c.product_count}</span></td>
                <td style={{ padding: '12px 16px' }}><button onClick={() => del(c.id, c.name)} style={{ padding: '5px', border: '1px solid #fee2e2', borderRadius: 6, background: '#fff', cursor: 'pointer' }}><Trash2 size={13} color="#ef4444" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
