import React, { useEffect, useState } from 'react';
import API from '../api/client';
import toast from 'react-hot-toast';
import { Plus, Search, Building2, Edit2, X } from 'lucide-react';

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480 }}>
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

const defaultForm = { name: '', contact_person: '', email: '', phone: '', city: '', address: '' };

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/inventory/suppliers', { params: search ? { search } : {} });
      setSuppliers(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search]);

  const openAdd = () => { setEditSupplier(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (s) => { setEditSupplier(s); setForm({ name: s.name, contact_person: s.contact_person || '', email: '', phone: s.phone || '', city: s.city || '', address: '' }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.phone) { toast.error('Name and phone are required'); return; }
    try {
      if (editSupplier) { await API.put(`/api/inventory/suppliers/${editSupplier.id}`, form); toast.success('Supplier updated'); }
      else { await API.post('/api/inventory/suppliers', form); toast.success('Supplier added'); }
      setShowModal(false); load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
  };

  const totalPayable = suppliers.reduce((s, sup) => s + (sup.balance || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 26, fontWeight: 800 }}>Suppliers</h1><p style={{ color: '#64748b', marginTop: 2 }}>Manage supplier accounts and payables</p></div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={18} /> Add Supplier
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          ['Total Suppliers', suppliers.length, '#3b82f6'],
          ['Total Payable', `Rs. ${totalPayable.toLocaleString()}`, '#ef4444'],
          ['Active Suppliers', suppliers.length, '#10b981'],
        ].map(([label, value, color]) => (
          <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
        <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search suppliers..." style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' }} />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['Supplier Name', 'Contact Person', 'Phone', 'City', 'Balance Due', ''].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#64748b' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading...</td></tr>
              : suppliers.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}><Building2 size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />No suppliers found</td></tr>
              : suppliers.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{s.contact_person || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{s.phone}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{s.city || '-'}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: s.balance > 0 ? '#ef4444' : '#10b981' }}>Rs. {s.balance?.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => openEdit(s)} style={{ padding: '6px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}><Edit2 size={14} color="#3b82f6" /></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editSupplier ? 'Edit Supplier' : 'Add Supplier'} onClose={() => setShowModal(false)}>
          <Input label="Supplier Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Contact Person" value={form.contact_person} onChange={e => setForm({ ...form, contact_person: e.target.value })} />
          <Input label="Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            <button onClick={handleSave} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
