import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { formatDate } from '../utils/dateFormat';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import Pagination, { usePagination } from '../components/ui/Pagination';
import { PageSpinner } from '../components/ui/Spinner';
import { exportCSV } from '../utils/csvExport';
import { Plus, Search, Truck, Trash2, Eye, Printer, Download, DollarSign, PackageSearch } from 'lucide-react';

export default function Purchases() {
  const [purchases, setPurchases]           = useState([]);
  const [suppliers, setSuppliers]           = useState([]);
  const [products, setProducts]             = useState([]);
  const [search, setSearch]                 = useState('');
  const [loading, setLoading]               = useState(true);
  const [showForm, setShowForm]             = useState(false);
  const [viewPO, setViewPO]                 = useState(null);
  const [cartItems, setCartItems]           = useState([]);
  const [form, setForm]                     = useState({ supplier_id: '', discount: 0, tax: 0, paid: 0, payment_method: 'cash', notes: '' });
  const [productSearch, setProductSearch]   = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const { page, setPage, paginated, total, pageSize } = usePagination(purchases, 20);

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, sRes, prRes] = await Promise.all([
        API.get('/api/purchases/', { params: search ? { search } : {} }),
        API.get('/api/inventory/suppliers'),
        API.get('/api/inventory/products'),
      ]);
      setPurchases(pRes.data.purchases);
      setSuppliers(sRes.data);
      setProducts(prRes.data.products);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search]);

  useEffect(() => {
    if (productSearch.length > 1) setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())));
    else setFilteredProducts([]);
  }, [productSearch, products]);

  const addToCart = (product) => {
    const existing = cartItems.find(i => i.product_id === product.id);
    if (existing) setCartItems(cartItems.map(i => i.product_id === product.id ? { ...i, qty: i.qty + 1, total: (i.qty + 1) * i.cost } : i));
    else setCartItems([...cartItems, { product_id: product.id, name: product.name, cost: product.cost_price, qty: 1, total: product.cost_price }]);
    setProductSearch(''); setFilteredProducts([]);
  };

  const subtotal  = cartItems.reduce((s, i) => s + i.total, 0);
  const totalAmt  = subtotal - parseFloat(form.discount || 0) + parseFloat(form.tax || 0);

  const handleSave = async () => {
    if (!form.supplier_id) { toast.error('Select a supplier'); return; }
    if (cartItems.length === 0) { toast.error('Add at least one item'); return; }
    try {
      await API.post('/api/purchases/', {
        supplier_id: parseInt(form.supplier_id),
        items: cartItems.map(i => ({ product_id: i.product_id, quantity: i.qty, unit_cost: i.cost })),
        discount: parseFloat(form.discount) || 0, tax: parseFloat(form.tax) || 0,
        paid: parseFloat(form.paid) || 0, payment_method: form.payment_method, notes: form.notes,
      });
      toast.success('Purchase order created!');
      setShowForm(false); setCartItems([]);
      setForm({ supplier_id: '', discount: 0, tax: 0, paid: 0, payment_method: 'cash', notes: '' });
      load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
  };

  const printPO = (po) => {
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>PO ${po.po_number}</title>
    <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#1e293b}
    .page{width:210mm;min-height:297mm;margin:0 auto;padding:20mm}
    .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1e40af;padding-bottom:16px;margin-bottom:24px}
    .brand{font-size:26px;font-weight:900;color:#1e40af}.sub{font-size:11px;color:#64748b;margin-top:3px}
    .po-title{text-align:right}.po-title h2{font-size:28px;font-weight:900;color:#1e40af;letter-spacing:2px}
    .info{display:flex;gap:20px;margin-bottom:24px}.info-box{flex:1;background:#f8fafc;border-radius:8px;padding:14px;border-left:4px solid #1e40af}
    .info-box h4{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-bottom:6px}
    .info-box p{font-size:14px;font-weight:600}.info-box span{font-size:12px;color:#64748b}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    thead tr{background:#1e40af;color:#fff}thead th{padding:10px 14px;text-align:left;font-size:12px;font-weight:700}
    thead th:last-child{text-align:right}
    tbody tr:nth-child(even){background:#f8fafc}tbody td{padding:10px 14px;font-size:13px}tbody td:last-child{text-align:right;font-weight:700}
    .total-box{display:flex;justify-content:flex-end}.totals{width:260px}
    .t-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px solid #f1f5f9}
    .t-row span:first-child{color:#64748b}
    .t-final{display:flex;justify-content:space-between;padding:12px 14px;background:#1e40af;color:#fff;border-radius:8px;font-size:18px;font-weight:900;margin-top:6px}
    .t-paid{display:flex;justify-content:space-between;padding:8px 14px;background:#d1fae5;border-radius:8px;font-size:14px;font-weight:700;color:#065f46;margin-top:6px}
    .t-bal{display:flex;justify-content:space-between;padding:8px 14px;background:#fee2e2;border-radius:8px;font-size:14px;font-weight:700;color:#991b1b;margin-top:4px}
    .footer{text-align:center;border-top:2px solid #e2e8f0;padding-top:16px;font-size:12px;color:#94a3b8;margin-top:24px}
    @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head>
    <body><div class="page">
    <div class="header">
      <div><div class="brand">ProBiz ERP</div><div class="sub">Advanced Pharmacy & Business Management</div><div class="sub">📍 House 124, Street 39, I-14/3, Islamabad</div><div class="sub">📞 0316-8818693</div></div>
      <div class="po-title"><h2>PURCHASE ORDER</h2><div style="font-size:14px;font-weight:700;color:#475569;margin-top:4px">${po.po_number}</div><div style="font-size:12px;color:#64748b">${po.created_at ? new Date(po.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</div></div>
    </div>
    <div class="info">
      <div class="info-box"><h4>Supplier</h4><p>${po.supplier?.name || ''}</p><span>${po.supplier?.phone || ''}</span>${po.supplier?.city ? `<br/><span>${po.supplier.city}</span>` : ''}</div>
      <div class="info-box"><h4>Payment Info</h4><p>${(po.payment_method || 'cash').replace('_', ' ').toUpperCase()}</p><span>Status: ${(po.status || '').toUpperCase()}</span></div>
    </div>
    <table>
      <thead><tr><th>#</th><th>Product</th><th>Unit Cost</th><th>Qty</th><th>Total</th></tr></thead>
      <tbody>${po.items?.map((item, i) => `<tr><td style="color:#94a3b8">${i + 1}</td><td><strong>${item.product_name}</strong></td><td>Rs. ${item.unit_cost?.toLocaleString()}</td><td>${item.quantity}</td><td>Rs. ${item.total?.toLocaleString()}</td></tr>`).join('')}</tbody>
    </table>
    <div class="total-box"><div class="totals">
      ${po.discount > 0 ? `<div class="t-row"><span>Discount</span><span style="color:#ef4444">- Rs. ${po.discount?.toLocaleString()}</span></div>` : ''}
      ${po.tax > 0 ? `<div class="t-row"><span>Tax</span><span>Rs. ${po.tax?.toLocaleString()}</span></div>` : ''}
      <div class="t-final"><span>TOTAL</span><span>Rs. ${po.total?.toLocaleString()}</span></div>
      <div class="t-paid"><span>✓ Paid</span><span>Rs. ${po.paid?.toLocaleString()}</span></div>
      ${po.balance > 0 ? `<div class="t-bal"><span>Balance Due</span><span>Rs. ${po.balance?.toLocaleString()}</span></div>` : ''}
    </div></div>
    <div class="footer"><p>ProBiz ERP &nbsp;|&nbsp; probiz-erp-poru.vercel.app &nbsp;|&nbsp; Computer-generated document</p></div>
    </div><script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  };

  const todayPO    = purchases.filter(p => new Date(p.created_at).toDateString() === new Date().toDateString());
  const todayTotal = todayPO.reduce((s, p) => s + (p.total || 0), 0);

  if (loading) return <PageSpinner text="Loading purchases..." />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Purchases</h1>
          <p className="page-subtitle">Manage purchase orders and supplier payments</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(purchases.map(p => ({ PO: p.po_number, Supplier: p.supplier, Total: p.total, Paid: p.paid, Balance: p.balance, Payment: p.payment_method, Status: p.status, Date: p.created_at })), 'purchases.csv')} className="btn-secondary text-xs">
            <Download size={13} /> Export
          </button>
          <button onClick={() => setShowForm(true)} className="btn-primary text-xs">
            <Plus size={14} /> New Purchase
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Today's Orders", value: todayPO.length, icon: PackageSearch, iconCls: 'text-blue-600', bgCls: 'bg-blue-50' },
          { label: "Today's Spend", value: `Rs. ${todayTotal.toLocaleString()}`, icon: DollarSign, iconCls: 'text-red-500', bgCls: 'bg-red-50' },
          { label: 'Total POs', value: purchases.length, icon: Truck, iconCls: 'text-violet-600', bgCls: 'bg-violet-50' },
        ].map(c => (
          <div key={c.label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.bgCls} flex items-center justify-center shrink-0`}><c.icon size={18} className={c.iconCls} /></div>
            <div><p className="text-xl font-bold text-gray-900">{c.value}</p><p className="text-xs text-gray-500">{c.label}</p></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-8 text-sm" placeholder="Search PO number..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>{['PO Number', 'Supplier', 'Total', 'Paid', 'Balance', 'Payment', 'Status', 'Date', ''].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400"><Truck size={36} className="mx-auto mb-2 opacity-30" />No purchases yet</td></tr>
              ) : paginated.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="table-cell font-bold text-blue-700">{p.po_number}</td>
                  <td className="table-cell">{p.supplier}</td>
                  <td className="table-cell font-bold">Rs. {p.total?.toLocaleString()}</td>
                  <td className="table-cell font-semibold text-emerald-600">Rs. {p.paid?.toLocaleString()}</td>
                  <td className="table-cell font-bold"><span className={p.balance > 0 ? 'text-red-500' : 'text-emerald-600'}>Rs. {p.balance?.toLocaleString()}</span></td>
                  <td className="table-cell"><span className="badge-gray capitalize">{p.payment_method}</span></td>
                  <td className="table-cell"><span className={p.status === 'completed' ? 'badge-green' : 'badge-yellow'}>{p.status}</span></td>
                  <td className="table-cell text-xs text-gray-500">{p.created_at ? formatDate(p.created_at) : '—'}</td>
                  <td className="table-cell">
                    <button onClick={async () => { const r = await API.get(`/api/purchases/${p.id}`); setViewPO(r.data); }} className="flex items-center gap-1 px-2 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs text-blue-600 font-medium transition-colors">
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} />
      </div>

      {/* New PO Modal */}
      {showForm && (
        <Modal title="New Purchase Order" onClose={() => setShowForm(false)} size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
            {/* Left: product search + cart */}
            <div className="space-y-3">
              <select className="input text-sm" value={form.supplier_id} onChange={e => setF('supplier_id', e.target.value)}>
                <option value="">Select Supplier *</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div className="relative">
                <input className="input text-sm" value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search product to add..." />
                {filteredProducts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl z-20 max-h-52 overflow-y-auto shadow-xl mt-1">
                    {filteredProducts.map(p => (
                      <div key={p.id} onClick={() => addToCart(p)} className="flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                        <span className="text-sm font-semibold text-gray-800">{p.name}</span>
                        <span className="text-xs text-gray-500 font-medium">Cost: Rs. {p.cost_price?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl p-3 min-h-[180px]">
                {cartItems.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm pt-14">Search and add products above</p>
                ) : cartItems.map(item => (
                  <div key={item.product_id} className="flex items-center gap-3 py-2.5 border-b border-gray-200 last:border-0">
                    <span className="flex-1 text-sm font-semibold text-gray-800 truncate">{item.name}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setCartItems(cartItems.map(i => i.product_id === item.product_id && i.qty > 1 ? { ...i, qty: i.qty - 1, total: (i.qty - 1) * i.cost } : i))} className="w-6 h-6 border border-gray-200 rounded-md bg-white text-sm font-bold hover:bg-gray-100">-</button>
                      <span className="w-7 text-center text-sm font-bold">{item.qty}</span>
                      <button onClick={() => setCartItems(cartItems.map(i => i.product_id === item.product_id ? { ...i, qty: i.qty + 1, total: (i.qty + 1) * i.cost } : i))} className="w-6 h-6 border border-gray-200 rounded-md bg-white text-sm font-bold hover:bg-gray-100">+</button>
                    </div>
                    <input type="number" value={item.cost} onChange={e => setCartItems(cartItems.map(i => i.product_id === item.product_id ? { ...i, cost: parseFloat(e.target.value) || 0, total: i.qty * (parseFloat(e.target.value) || 0) } : i))}
                      className="w-24 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center" />
                    <span className="font-bold text-sm min-w-[70px] text-right">Rs. {item.total?.toLocaleString()}</span>
                    <button onClick={() => setCartItems(cartItems.filter(i => i.product_id !== item.product_id))}><Trash2 size={14} className="text-red-400 hover:text-red-600" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: order summary */}
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-gray-800">Order Summary</h4>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-semibold">Rs. {subtotal.toLocaleString()}</span></div>
              {[['Discount (Rs.)', 'discount'], ['Tax (Rs.)', 'tax'], ['Amount Paid', 'paid']].map(([label, key]) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input type="number" className="input text-sm" value={form[key]} onChange={e => setF(key, e.target.value)} />
                </div>
              ))}
              <div>
                <label className="label">Payment Method</label>
                <select className="input text-sm" value={form.payment_method} onChange={e => setF('payment_method', e.target.value)}>
                  {['cash', 'card', 'bank_transfer', 'cheque', 'credit'].map(m => <option key={m} value={m}>{m.replace('_', ' ').toUpperCase()}</option>)}
                </select>
              </div>
              <div className="flex justify-between py-3 border-t border-gray-200 text-lg font-extrabold">
                <span>TOTAL</span><span className="text-blue-700">Rs. {totalAmt.toLocaleString()}</span>
              </div>
              <button onClick={handleSave} className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-base transition-colors">
                Create Purchase Order
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View PO Modal */}
      {viewPO && (
        <Modal title={`PO: ${viewPO.po_number}`} onClose={() => setViewPO(null)} size="md">
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl p-4 mb-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xl font-extrabold">ProBiz ERP</p>
                <p className="text-xs opacity-75">House 124, Street 39, I-14/3, Islamabad</p>
                <p className="text-xs opacity-75">📞 0316-8818693</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-60 tracking-widest">PURCHASE ORDER</p>
                <p className="text-base font-bold">{viewPO.po_number}</p>
                <p className="text-xs opacity-75">{viewPO.created_at ? formatDate(viewPO.created_at) : '—'}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-600">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Supplier</p>
              <p className="font-bold text-sm">{viewPO.supplier?.name}</p>
              {viewPO.supplier?.phone && <p className="text-xs text-gray-500">{viewPO.supplier.phone}</p>}
              {viewPO.supplier?.city && <p className="text-xs text-gray-500">{viewPO.supplier.city}</p>}
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-emerald-500">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Payment</p>
              <p className="font-bold text-sm capitalize">{(viewPO.payment_method || '').replace('_', ' ')}</p>
              <span className={viewPO.status === 'completed' ? 'badge-green' : 'badge-yellow'}>{viewPO.status?.toUpperCase()}</span>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-100 mb-4">
            <table className="w-full text-sm">
              <thead><tr className="bg-blue-800 text-white">{['Product', 'Qty', 'Unit Cost', 'Total'].map(h => <th key={h} className={`px-3 py-2 text-xs font-semibold ${h === 'Total' ? 'text-right' : 'text-left'}`}>{h}</th>)}</tr></thead>
              <tbody>
                {viewPO.items?.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 font-semibold">{item.product_name}</td>
                    <td className="px-3 py-2 text-gray-500">{item.quantity}</td>
                    <td className="px-3 py-2">Rs. {item.unit_cost?.toLocaleString()}</td>
                    <td className="px-3 py-2 font-bold text-right">Rs. {item.total?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {viewPO.discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span className="text-red-500 font-semibold">- Rs. {viewPO.discount?.toLocaleString()}</span></div>}
            {viewPO.tax > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Tax</span><span>Rs. {viewPO.tax?.toLocaleString()}</span></div>}
            <div className="flex justify-between items-center bg-blue-800 text-white rounded-xl px-4 py-3 text-lg font-extrabold">
              <span>TOTAL</span><span>Rs. {viewPO.total?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-700">
              <span>✓ Paid</span><span>Rs. {viewPO.paid?.toLocaleString()}</span>
            </div>
            {viewPO.balance > 0 && <div className="flex justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600"><span>Balance Due</span><span>Rs. {viewPO.balance?.toLocaleString()}</span></div>}
          </div>
          <button onClick={() => printPO(viewPO)} className="btn-primary w-full justify-center mt-4">
            <Printer size={15} /> Print / Save as PDF
          </button>
        </Modal>
      )}
    </div>
  );
}
