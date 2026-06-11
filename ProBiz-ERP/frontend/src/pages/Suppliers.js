import React, { useEffect, useState } from 'react';
import API from '../api/client';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import Pagination, { usePagination } from '../components/ui/Pagination';
import { PageSpinner } from '../components/ui/Spinner';
import { exportCSV } from '../utils/csvExport';
import { Plus, Search, Building2, Edit2, Download, DollarSign, Truck } from 'lucide-react';

const defaultForm = { name: '', contact_person: '', email: '', phone: '', city: '', address: '' };

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null);
  const [form, setForm]           = useState(defaultForm);
  const [saving, setSaving]       = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const { page, setPage, paginated, total, pageSize } = usePagination(suppliers, 20);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/inventory/suppliers', { params: search ? { search } : {} });
      setSuppliers(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search]);

  const openAdd  = () => { setForm(defaultForm); setModal('add'); };
  const openEdit = (s) => { setForm({ name: s.name, contact_person: s.contact_person || '', email: '', phone: s.phone || '', city: s.city || '', address: '', _id: s.id }); setModal('edit'); };

  const handleSave = async () => {
    if (!form.name || !form.phone) { toast.error('Name and phone are required'); return; }
    setSaving(true);
    try {
      if (modal === 'edit') { await API.put(`/api/inventory/suppliers/${form._id}`, form); toast.success('Supplier updated'); }
      else { await API.post('/api/inventory/suppliers', form); toast.success('Supplier added'); }
      setModal(null); load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
    finally { setSaving(false); }
  };

  const totalPayable = suppliers.reduce((s, sup) => s + (sup.balance || 0), 0);

  if (loading) return <PageSpinner text="Loading suppliers..." />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Suppliers</h1>
          <p className="page-subtitle">Manage supplier accounts and payables</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(suppliers.map(s => ({ Name: s.name, Contact: s.contact_person, Phone: s.phone, City: s.city, 'Balance Due': s.balance })), 'suppliers.csv')} className="btn-secondary text-xs">
            <Download size={13} /> Export
          </button>
          <button onClick={openAdd} className="btn-primary text-xs">
            <Plus size={14} /> Add Supplier
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Suppliers', value: suppliers.length, icon: Building2, iconCls: 'text-blue-600', bgCls: 'bg-blue-50' },
          { label: 'Total Payable', value: `Rs. ${totalPayable.toLocaleString()}`, icon: DollarSign, iconCls: 'text-red-500', bgCls: 'bg-red-50' },
          { label: 'Active Suppliers', value: suppliers.length, icon: Truck, iconCls: 'text-emerald-600', bgCls: 'bg-emerald-50' },
        ].map(c => (
          <div key={c.label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.bgCls} flex items-center justify-center shrink-0`}>
              <c.icon size={18} className={c.iconCls} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-8 text-sm" placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Supplier Name', 'Contact Person', 'Phone', 'City', 'Balance Due', ''].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">
                  <Building2 size={36} className="mx-auto mb-2 opacity-30" />No suppliers found
                </td></tr>
              ) : paginated.map(s => (
                <tr key={s.id} className="table-row">
                  <td className="table-cell font-semibold text-gray-900">{s.name}</td>
                  <td className="table-cell">{s.contact_person || '—'}</td>
                  <td className="table-cell">{s.phone}</td>
                  <td className="table-cell">{s.city || '—'}</td>
                  <td className="table-cell font-bold">
                    <span className={s.balance > 0 ? 'text-red-500' : 'text-emerald-600'}>
                      Rs. {s.balance?.toLocaleString()}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button onClick={() => openEdit(s)} className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Edit2 size={13} className="text-blue-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} />
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          title={modal === 'edit' ? 'Edit Supplier' : 'Add Supplier'}
          onClose={() => setModal(null)}
          size="sm"
          footer={
            <div className="flex gap-2 justify-end">
              <button onClick={() => setModal(null)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            {[['Supplier Name *', 'name', 'text'], ['Contact Person', 'contact_person', 'text'], ['Phone *', 'phone', 'tel'], ['Email', 'email', 'email'], ['City', 'city', 'text']].map(([label, key, type]) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input type={type} className="input text-sm" value={form[key] || ''} onChange={e => set(key, e.target.value)} />
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
