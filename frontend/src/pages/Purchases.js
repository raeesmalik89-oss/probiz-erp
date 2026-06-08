import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { formatDate } from '../utils/dateFormat';
import toast from 'react-hot-toast';
import { Plus, Search, Truck, Trash2, X, Eye, Printer } from 'lucide-react';

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: wide ? 800 : 500, maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 18 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewPO, setViewPO] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({ supplier_id: '', discount: 0, tax: 0, paid: 0, payment_method: 'cash', notes: '' });
  const [productSearch, setProductSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

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

  const subtotal = cartItems.reduce((s, i) => s + i.total, 0);
  const total = subtotal - parseFloat(form.discount || 0) + parseFloat(form.tax || 0);

  const handleSave = async () => {
    if (!form.supplier_id) { toast.error('Select a supplier'); return; }
    if (cartItems.length === 0) { toast.error('Add at least one item'); return; }
    try {
      await API.post('/api/purchases/', {
        supplier_id: parseInt(form.supplier_id),
        items: cartItems.map(i => ({ product_id: i.product_id, quantity: i.qty, unit_cost: i.cost })),
        discount: parseFloat(form.discount) || 0,
        tax: parseFloat(form.tax) || 0,
        paid: parseFloat(form.paid) || 0,
        payment_method: form.payment_method,
        notes: form.notes,
      });
      toast.success('Purchase order created!');
      setShowForm(false);
      setCartItems([]);
      setForm({ supplier_id: '', discount: 0, tax: 0, paid: 0, payment_method: 'cash', notes: '' });
      load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 26, fontWeight: 800 }}>Purchases</h1><p style={{ color: '#64748b', marginTop: 2 }}>Manage purchase orders and supplier payments</p></div>
        <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={18} /> New Purchase
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
        <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search PO number..." style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' }} />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['PO Number', 'Supplier', 'Total', 'Paid', 'Balance', 'Payment', 'Status', 'Date', ''].map(h => (
              <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#64748b' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading...</td></tr>
              : purchases.length === 0 ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}><Truck size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />No purchases yet</td></tr>
              : purchases.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '11px 14px', color: '#1e40af', fontWeight: 700 }}>{p.po_number}</td>
                  <td style={{ padding: '11px 14px' }}>{p.supplier}</td>
                  <td style={{ padding: '11px 14px', fontWeight: 700 }}>Rs. {p.total?.toLocaleString()}</td>
                  <td style={{ padding: '11px 14px', color: '#10b981', fontWeight: 600 }}>Rs. {p.paid?.toLocaleString()}</td>
                  <td style={{ padding: '11px 14px', color: p.balance > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>Rs. {p.balance?.toLocaleString()}</td>
                  <td style={{ padding: '11px 14px' }}><span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 20, fontSize: 12 }}>{p.payment_method}</span></td>
                  <td style={{ padding: '11px 14px' }}><span style={{ background: '#d1fae5', color: '#065f46', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{p.status}</span></td>
                  <td style={{ padding: '11px 14px', color: '#64748b', fontSize: 12 }}>{p.created_at ? formatDate(p.created_at) : '-'}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <button onClick={async () => { const r = await API.get(`/api/purchases/${p.id}`); setViewPO(r.data); }} style={{ padding: '5px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}><Eye size={14} color="#3b82f6" /></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal title="New Purchase Order" onClose={() => setShowForm(false)} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            <div>
              <select value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, marginBottom: 12, background: '#fff' }}>
                <option value="">Select Supplier *</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search product to add..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
                {filteredProducts.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, zIndex: 10, maxHeight: 200, overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    {filteredProducts.map(p => (
                      <div key={p.id} onClick={() => addToCart(p)} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                        <span style={{ color: '#64748b', fontSize: 13 }}>Cost: Rs. {p.cost_price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 10, minHeight: 180, padding: 12 }}>
                {cartItems.length === 0 ? <p style={{ textAlign: 'center', color: '#94a3b8', paddingTop: 50 }}>Add products above</p>
                  : cartItems.map(item => (
                    <div key={item.product_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ flex: 1, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => setCartItems(cartItems.map(i => i.product_id === item.product_id && i.qty > 1 ? { ...i, qty: i.qty - 1, total: (i.qty - 1) * i.cost } : i))} style={{ width: 26, height: 26, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>-</button>
                        <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                        <button onClick={() => setCartItems(cartItems.map(i => i.product_id === item.product_id ? { ...i, qty: i.qty + 1, total: (i.qty + 1) * i.cost } : i))} style={{ width: 26, height: 26, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>+</button>
                      </div>
                      <input type="number" value={item.cost} onChange={e => setCartItems(cartItems.map(i => i.product_id === item.product_id ? { ...i, cost: parseFloat(e.target.value) || 0, total: i.qty * (parseFloat(e.target.value) || 0) } : i))} style={{ width: 90, padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13 }} />
                      <span style={{ fontWeight: 700, minWidth: 80, textAlign: 'right' }}>Rs. {item.total?.toLocaleString()}</span>
                      <button onClick={() => setCartItems(cartItems.filter(i => i.product_id !== item.product_id))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} color="#ef4444" /></button>
                    </div>
                  ))}
              </div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Order Summary</h4>
              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>Subtotal: <b style={{ color: '#1e293b' }}>Rs. {subtotal.toLocaleString()}</b></div>
              {[['Discount (Rs.)', 'discount'], ['Tax (Rs.)', 'tax'], ['Amount Paid', 'paid']].map(([label, key]) => (
                <div key={key} style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}</label>
                  <input type="number" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14 }} />
                </div>
              ))}
              <div style={{ fontWeight: 800, fontSize: 18, margin: '12px 0', color: '#1e40af' }}>TOTAL: Rs. {total.toLocaleString()}</div>
              <button onClick={handleSave} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Create Purchase Order</button>
            </div>
          </div>
        </Modal>
      )}

      {viewPO && (
        <Modal title={`PO: ${viewPO.po_number}`} onClose={() => setViewPO(null)}>
          {/* PO Header */}
          <div style={{ background: 'linear-gradient(135deg,#1e40af,#3b82f6)', borderRadius: 12, padding: '16px 20px', marginBottom: 16, color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>ProBiz ERP</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>House 124, Street 39, I-14/3, Islamabad</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>📞 0316-8818693</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 2 }}>PURCHASE ORDER</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{viewPO.po_number}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{viewPO.created_at ? new Date(viewPO.created_at).toLocaleDateString('en-PK') : '-'}</div>
              </div>
            </div>
          </div>

          {/* Supplier & Payment Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 14px', borderLeft: '3px solid #1e40af' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Supplier</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{viewPO.supplier?.name}</div>
              {viewPO.supplier?.phone && <div style={{ fontSize: 12, color: '#64748b' }}>{viewPO.supplier.phone}</div>}
              {viewPO.supplier?.city && <div style={{ fontSize: 12, color: '#64748b' }}>{viewPO.supplier.city}</div>}
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 14px', borderLeft: '3px solid #10b981' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Payment</div>
              <div style={{ fontWeight: 700, fontSize: 14, textTransform: 'capitalize' }}>{(viewPO.payment_method || '').replace('_', ' ')}</div>
              <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{viewPO.status?.toUpperCase()}</span>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
            <thead><tr style={{ background: '#1e40af', color: '#fff' }}>
              {['Product', 'Qty', 'Unit Cost', 'Total'].map(h => <th key={h} style={{ padding: '8px 12px', textAlign: h === 'Total' ? 'right' : 'left', fontWeight: 600, fontSize: 12 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {viewPO.items?.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding: '9px 12px', fontWeight: 600 }}>{item.product_name}</td>
                  <td style={{ padding: '9px 12px', color: '#64748b' }}>{item.quantity}</td>
                  <td style={{ padding: '9px 12px' }}>Rs. {item.unit_cost?.toLocaleString()}</td>
                  <td style={{ padding: '9px 12px', fontWeight: 700, textAlign: 'right' }}>Rs. {item.total?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 4 }}>
            {viewPO.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}><span style={{ color: '#64748b' }}>Discount</span><span style={{ color: '#ef4444' }}>- Rs. {viewPO.discount?.toLocaleString()}</span></div>}
            {viewPO.tax > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}><span style={{ color: '#64748b' }}>Tax</span><span>Rs. {viewPO.tax?.toLocaleString()}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 18, background: '#1e40af', color: '#fff', borderRadius: 8, padding: '10px 14px', marginBottom: 8 }}>
              <span>TOTAL</span><span>Rs. {viewPO.total?.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, background: '#d1fae5', borderRadius: 8, padding: '8px 14px', color: '#065f46' }}>
              <span>✓ Paid</span><span>Rs. {viewPO.paid?.toLocaleString()}</span>
            </div>
            {viewPO.balance > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, background: '#fee2e2', borderRadius: 8, padding: '8px 14px', color: '#991b1b', marginTop: 6 }}><span>Balance Due</span><span>Rs. {viewPO.balance?.toLocaleString()}</span></div>}
          </div>

          {/* Print Button */}
          <button onClick={() => {
            const w = window.open('', '_blank');
            w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>PO ${viewPO.po_number}</title>
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
              <div class="po-title"><h2>PURCHASE ORDER</h2><div style="font-size:14px;font-weight:700;color:#475569;margin-top:4px">${viewPO.po_number}</div><div style="font-size:12px;color:#64748b">${viewPO.created_at ? new Date(viewPO.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</div></div>
            </div>
            <div class="info">
              <div class="info-box"><h4>Supplier</h4><p>${viewPO.supplier?.name || ''}</p><span>${viewPO.supplier?.phone || ''}</span>${viewPO.supplier?.city ? `<br/><span>${viewPO.supplier.city}</span>` : ''}</div>
              <div class="info-box"><h4>Payment Info</h4><p>${(viewPO.payment_method || 'cash').replace('_', ' ').toUpperCase()}</p><span>Status: ${(viewPO.status || '').toUpperCase()}</span></div>
            </div>
            <table>
              <thead><tr><th>#</th><th>Product</th><th>Unit Cost</th><th>Qty</th><th>Total</th></tr></thead>
              <tbody>${viewPO.items?.map((item, i) => `<tr><td style="color:#94a3b8">${i + 1}</td><td><strong>${item.product_name}</strong></td><td>Rs. ${item.unit_cost?.toLocaleString()}</td><td>${item.quantity}</td><td>Rs. ${item.total?.toLocaleString()}</td></tr>`).join('')}</tbody>
            </table>
            <div class="total-box"><div class="totals">
              ${viewPO.discount > 0 ? `<div class="t-row"><span>Discount</span><span style="color:#ef4444">- Rs. ${viewPO.discount?.toLocaleString()}</span></div>` : ''}
              ${viewPO.tax > 0 ? `<div class="t-row"><span>Tax</span><span>Rs. ${viewPO.tax?.toLocaleString()}</span></div>` : ''}
              <div class="t-final"><span>TOTAL</span><span>Rs. ${viewPO.total?.toLocaleString()}</span></div>
              <div class="t-paid"><span>✓ Paid</span><span>Rs. ${viewPO.paid?.toLocaleString()}</span></div>
              ${viewPO.balance > 0 ? `<div class="t-bal"><span>Balance Due</span><span>Rs. ${viewPO.balance?.toLocaleString()}</span></div>` : ''}
            </div></div>
            <div class="footer"><p>ProBiz ERP &nbsp;|&nbsp; probiz-erp-poru.vercel.app &nbsp;|&nbsp; Computer-generated document</p></div>
            </div><script>window.onload=()=>window.print()</script></body></html>`);
            w.document.close();
          }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', width: '100%', justifyContent: 'center', marginTop: 16 }}>
            <Printer size={16} /> Print / Save as PDF
          </button>
        </Modal>
      )}
    </div>
  );
}
