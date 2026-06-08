import React, { useEffect, useState } from 'react';
import API from '../api/client';
import toast from 'react-hot-toast';
import { Plus, Search, Users, Edit2, X } from 'lucide-react';

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 18 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 5 }}>{label}</label>
    <input {...props} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif' }} />
  </div>
);

const defaultForm = { name: '', email: '', phone: '', address: '', city: '', credit_limit: 0 };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/sales/customers', { params: search ? { search } : {} });
      setCustomers(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search]);

  const openAdd = () => { setEditCustomer(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (c) => { setEditCustomer(c); setForm({ name: c.name, email: '', phone: c.phone || '', address: '', city: c.city || '', credit_limit: c.credit_limit || 0 }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name) { toast.error('Name is required'); return; }
    try {
      if (editCustomer) { await API.put(`/api/sales/customers/${editCustomer.id}`, form); toast.success('Customer updated'); }
      else { await API.post('/api/sales/customers', form); toast.success('Customer added'); }
      setShowModal(false); load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
  };

  const totalReceivable = customers.reduce((s, c) => s + (c.balance || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 26, fontWeight: 800 }}>Customers</h1><p style={{ color: '#64748b', marginTop: 2 }}>Manage customer accounts and balances</p></div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={18} /> Add Customer
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          ['Total Customers', customers.length, '#3b82f6', '#dbeafe'],
          ['Total Receivable', `Rs. ${totalReceivable.toLocaleString()}`, '#ef4444', '#fee2e2'],
          ['With Credit Limit', customers.filter(c => c.credit_limit > 0).length, '#10b981', '#d1fae5'],
        ].map(([label, value, color, bg]) => (
          <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
        <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' }} />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['Customer Name', 'Phone', 'City', 'Credit Limit', 'Balance Due', ''].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#64748b' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading...</td></tr>
              : customers.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}><Users size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />No customers found</td></tr>
              : customers.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{c.phone || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{c.city || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#3b82f6', fontWeight: 600 }}>Rs. {c.credit_limit?.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: c.balance > 0 ? '#ef4444' : '#10b981' }}>Rs. {c.balance?.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => openEdit(c)} style={{ padding: '6px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}><Edit2 size={14} color="#3b82f6" /></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editCustomer ? 'Edit Customer' : 'Add Customer'} onClose={() => setShowModal(false)}>
          <Input label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          <Input label="Credit Limit (Rs.)" type="number" value={form.credit_limit} onChange={e => setForm({ ...form, credit_limit: parseFloat(e.target.value) || 0 })} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            <button onClick={handleSave} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
