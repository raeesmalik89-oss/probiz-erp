import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { formatDate, formatDateTime } from '../utils/dateFormat';
import toast from 'react-hot-toast';
import { Plus, Search, ShoppingCart, Trash2, X, Eye, Printer } from 'lucide-react';

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: wide ? 800 : 560, maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 18 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

// ─── Printable Invoice Component ─────────────────────────────────────────────
const PrintInvoice = ({ sale }) => {
  const printInvoice = () => {
    const printWindow = window.open('', '_blank');
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Invoice ${sale.invoice_no}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; color: #1e293b; background: #fff; }
          .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 20mm; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1e40af; padding-bottom: 16px; margin-bottom: 24px; }
          .brand-name { font-size: 28px; font-weight: 900; color: #1e40af; letter-spacing: -1px; }
          .brand-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
          .brand-contact { font-size: 11px; color: #475569; margin-top: 4px; }
          .invoice-title { text-align: right; }
          .invoice-title h2 { font-size: 32px; font-weight: 900; color: #1e40af; letter-spacing: 2px; }
          .invoice-title .inv-no { font-size: 14px; color: #475569; margin-top: 4px; font-weight: 700; }
          .invoice-title .inv-date { font-size: 12px; color: #64748b; margin-top: 2px; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 24px; gap: 24px; }
          .info-box { flex: 1; background: #f8fafc; border-radius: 8px; padding: 14px 16px; border-left: 4px solid #1e40af; }
          .info-box h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 6px; }
          .info-box p { font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 2px; }
          .info-box span { font-size: 12px; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          thead tr { background: #1e40af; color: #fff; }
          thead th { padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; }
          thead th:last-child { text-align: right; }
          tbody tr { border-bottom: 1px solid #f1f5f9; }
          tbody tr:nth-child(even) { background: #f8fafc; }
          tbody td { padding: 10px 14px; font-size: 13px; }
          tbody td:last-child { text-align: right; font-weight: 700; }
          .totals { display: flex; justify-content: flex-end; margin-bottom: 24px; }
          .totals-box { width: 260px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
          .totals-row span:first-child { color: #64748b; }
          .total-final { display: flex; justify-content: space-between; padding: 12px 14px; background: #1e40af; color: #fff; border-radius: 8px; font-size: 18px; font-weight: 900; margin-top: 6px; }
          .paid-row { display: flex; justify-content: space-between; padding: 8px 14px; background: #d1fae5; border-radius: 8px; font-size: 14px; font-weight: 700; color: #065f46; margin-top: 6px; }
          .change-row { display: flex; justify-content: space-between; padding: 8px 14px; background: #fff7ed; border-radius: 8px; font-size: 14px; font-weight: 700; color: #92400e; margin-top: 4px; }
          .footer { text-align: center; border-top: 2px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8; }
          .footer strong { color: #1e40af; }
          .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #d1fae5; color: #065f46; }
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            .page { padding: 10mm; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div>
              <div class="brand-name">ProBiz ERP</div>
              <div class="brand-sub">Advanced Pharmacy & Business Management</div>
              <div class="brand-contact">📍 House 124, Street 39, I-14/3, Islamabad</div>
              <div class="brand-contact">📞 0316-8818693 &nbsp;|&nbsp; ✉️ raees.malik89@gmail.com</div>
            </div>
            <div class="invoice-title">
              <h2>INVOICE</h2>
              <div class="inv-no">${sale.invoice_no}</div>
              <div class="inv-date">${new Date(new Date(sale.created_at).getTime() + 5*60*60*1000).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div style="margin-top:6px"><span class="badge">${(sale.status || 'completed').toUpperCase()}</span></div>
            </div>
          </div>

          <div class="info-section">
            <div class="info-box">
              <h4>Bill To</h4>
              <p>${sale.customer?.name || 'Walk-in Customer'}</p>
              ${sale.customer?.phone ? `<span>📞 ${sale.customer.phone}</span>` : ''}
              ${sale.customer?.city ? `<br/><span>📍 ${sale.customer.city}</span>` : ''}
            </div>
            <div class="info-box">
              <h4>Payment Info</h4>
              <p>${(sale.payment_method || 'Cash').replace('_', ' ').toUpperCase()}</p>
              <span>Date: ${new Date(new Date(sale.created_at).getTime() + 5*60*60*1000).toLocaleDateString('en-PK')}</span><br/>
              <span>Time: ${new Date(new Date(sale.created_at).getTime() + 5*60*60*1000).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Batch No.</th>
                <th>Mfg. Date</th>
                <th>Expiry Date</th>
                <th>Unit Price</th>
                <th>Qty</th>
                ${sale.items?.some(i => i.discount > 0) ? '<th>Disc.</th>' : ''}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${sale.items?.map((item, i) => `
                <tr>
                  <td style="color:#94a3b8">${i + 1}</td>
                  <td><strong>${item.product_name}</strong></td>
                  <td style="color:#475569">${item.batch_no || '—'}</td>
                  <td style="color:#475569">${item.mfg_date || '—'}</td>
                  <td style="color:${item.expiry_date ? '#dc2626' : '#475569'};font-weight:${item.expiry_date ? '700' : '400'}">${item.expiry_date || '—'}</td>
                  <td>Rs. ${item.unit_price?.toLocaleString()}</td>
                  <td>${item.quantity}</td>
                  ${sale.items?.some(i => i.discount > 0) ? `<td>Rs. ${item.discount?.toLocaleString() || 0}</td>` : ''}
                  <td>Rs. ${item.total?.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-box">
              <div class="totals-row"><span>Subtotal</span><span>Rs. ${sale.subtotal?.toLocaleString()}</span></div>
              ${sale.discount > 0 ? `<div class="totals-row"><span>Discount</span><span style="color:#ef4444">- Rs. ${sale.discount?.toLocaleString()}</span></div>` : ''}
              ${sale.tax > 0 ? `<div class="totals-row"><span>Tax</span><span>Rs. ${sale.tax?.toLocaleString()}</span></div>` : ''}
              <div class="total-final"><span>TOTAL</span><span>Rs. ${sale.total?.toLocaleString()}</span></div>
              <div class="paid-row"><span>✓ Paid</span><span>Rs. ${sale.paid?.toLocaleString()}</span></div>
              ${(sale.balance || 0) > 0 ? `<div class="change-row"><span>Balance Due</span><span>Rs. ${sale.balance?.toLocaleString()}</span></div>` : ''}
              ${(sale.paid - sale.total) > 0 ? `<div class="change-row"><span>Change</span><span>Rs. ${(sale.paid - sale.total)?.toLocaleString()}</span></div>` : ''}
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;margin-top:32px;margin-bottom:24px;gap:24px">
            <div style="flex:1;text-align:center">
              <div style="border-top:2px solid #1e40af;padding-top:8px;margin-top:40px">
                <div style="font-size:13px;font-weight:700;color:#1e293b">Pharmacist Signature</div>
                <div style="font-size:11px;color:#64748b;margin-top:2px">Licensed Pharmacist</div>
              </div>
            </div>
            <div style="flex:1;text-align:center">
              <div style="border-top:2px solid #1e40af;padding-top:8px;margin-top:40px">
                <div style="font-size:13px;font-weight:700;color:#1e293b">Manager Signature</div>
                <div style="font-size:11px;color:#64748b;margin-top:2px">Authorized Signatory</div>
              </div>
            </div>
            <div style="flex:1;text-align:center">
              <div style="border-top:2px solid #1e40af;padding-top:8px;margin-top:40px">
                <div style="font-size:13px;font-weight:700;color:#1e293b">Customer Signature</div>
                <div style="font-size:11px;color:#64748b;margin-top:2px">Received By</div>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for your business! &nbsp;|&nbsp; <strong>ProBiz ERP</strong> &nbsp;|&nbsp; probiz-erp-poru.vercel.app</p>
            <p style="margin-top:4px;font-size:10px">This is a computer-generated invoice. Valid subject to authorized signatures above.</p>
          </div>
        </div>
        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <button onClick={printInvoice} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', width: '100%', justifyContent: 'center', marginTop: 16 }}>
      <Printer size={16} /> Print / Save as PDF
    </button>
  );
};

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPOS, setShowPOS] = useState(false);
  const [viewSale, setViewSale] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [posForm, setPosForm] = useState({ customer_id: '', discount: 0, tax: 0, paid: 0, payment_method: 'cash' });
  const [productSearch, setProductSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, cRes, pRes] = await Promise.all([
        API.get('/api/sales/', { params: search ? { search } : {} }),
        API.get('/api/sales/customers'),
        API.get('/api/inventory/products'),
      ]);
      setSales(sRes.data.sales);
      setCustomers(cRes.data);
      setProducts(pRes.data.products);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search]);

  useEffect(() => {
    if (productSearch.length > 1) {
      setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || (p.barcode && p.barcode.includes(productSearch))));
    } else setFilteredProducts([]);
  }, [productSearch, products]);

  const addToCart = (product) => {
    const existing = cartItems.find(i => i.product_id === product.id);
    if (existing) {
      setCartItems(cartItems.map(i => i.product_id === product.id ? { ...i, qty: i.qty + 1, total: (i.qty + 1) * i.price } : i));
    } else {
      setCartItems([...cartItems, { product_id: product.id, name: product.name, price: product.sale_price, qty: 1, total: product.sale_price, discount: 0 }]);
    }
    setProductSearch('');
    setFilteredProducts([]);
  };

  const removeFromCart = (product_id) => setCartItems(cartItems.filter(i => i.product_id !== product_id));

  const updateCartQty = (product_id, qty) => {
    if (qty <= 0) { removeFromCart(product_id); return; }
    setCartItems(cartItems.map(i => i.product_id === product_id ? { ...i, qty, total: qty * i.price - i.discount } : i));
  };

  const subtotal = cartItems.reduce((s, i) => s + i.total, 0);
  const total = subtotal - parseFloat(posForm.discount || 0) + parseFloat(posForm.tax || 0);
  const change = parseFloat(posForm.paid || 0) - total;

  const handleSale = async () => {
    if (cartItems.length === 0) { toast.error('Add at least one product'); return; }
    try {
      const res = await API.post('/api/sales/', {
        customer_id: posForm.customer_id || null,
        items: cartItems.map(i => ({ product_id: i.product_id, quantity: i.qty, unit_price: i.price, discount: i.discount || 0 })),
        discount: parseFloat(posForm.discount) || 0,
        tax: parseFloat(posForm.tax) || 0,
        paid: parseFloat(posForm.paid) || total,
        payment_method: posForm.payment_method,
      });
      toast.success('Sale completed!');
      setShowPOS(false);
      setCartItems([]);
      setPosForm({ customer_id: '', discount: 0, tax: 0, paid: 0, payment_method: 'cash' });
      // Auto-open invoice after sale
      const detail = await API.get(`/api/sales/${res.data.id}`);
      setViewSale(detail.data);
      load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 26, fontWeight: 800 }}>Sales & POS</h1><p style={{ color: '#64748b', marginTop: 2 }}>Process sales and manage invoices</p></div>
        <button onClick={() => setShowPOS(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={18} /> New Sale
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
        <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' }} />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['Invoice No', 'Customer', 'Items', 'Total', 'Paid', 'Balance', 'Payment', 'Status', 'Date', ''].map(h => (
              <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#64748b' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading...</td></tr>
              : sales.length === 0 ? <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}><ShoppingCart size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />No sales yet</td></tr>
              : sales.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '11px 14px', color: '#1e40af', fontWeight: 700 }}>{s.invoice_no}</td>
                  <td style={{ padding: '11px 14px' }}>{s.customer}</td>
                  <td style={{ padding: '11px 14px', color: '#64748b' }}>{s.items_count}</td>
                  <td style={{ padding: '11px 14px', fontWeight: 700 }}>Rs. {s.total?.toLocaleString()}</td>
                  <td style={{ padding: '11px 14px', color: '#10b981', fontWeight: 600 }}>Rs. {s.paid?.toLocaleString()}</td>
                  <td style={{ padding: '11px 14px', color: s.balance > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>Rs. {s.balance?.toLocaleString()}</td>
                  <td style={{ padding: '11px 14px' }}><span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 20, fontSize: 12 }}>{s.payment_method}</span></td>
                  <td style={{ padding: '11px 14px' }}><span style={{ background: s.status === 'completed' ? '#d1fae5' : '#fee2e2', color: s.status === 'completed' ? '#065f46' : '#991b1b', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{s.status}</span></td>
                  <td style={{ padding: '11px 14px', color: '#64748b', fontSize: 12 }}>{s.created_at ? formatDate(s.created_at) : '-'}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <button onClick={async () => { const r = await API.get(`/api/sales/${s.id}`); setViewSale(r.data); }} style={{ padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                      <Eye size={14} color="#3b82f6" /> View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* POS Modal */}
      {showPOS && (
        <Modal title="New Sale — Point of Sale" onClose={() => setShowPOS(false)} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
            <div>
              <div style={{ marginBottom: 16 }}>
                <select value={posForm.customer_id} onChange={e => setPosForm({ ...posForm, customer_id: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, marginBottom: 12, background: '#fff' }}>
                  <option value="">Walk-in Customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
                </select>
                <div style={{ position: 'relative' }}>
                  <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search product by name or barcode..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
                  {filteredProducts.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, zIndex: 10, maxHeight: 220, overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                      {filteredProducts.map(p => (
                        <div key={p.id} onClick={() => addToCart(p)} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>Stock: {p.stock} {p.unit}</div>
                          </div>
                          <div style={{ fontWeight: 700, color: '#10b981', fontSize: 15 }}>Rs. {p.sale_price?.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 10, minHeight: 200, padding: 12 }}>
                {cartItems.length === 0 ? <p style={{ textAlign: 'center', color: '#94a3b8', paddingTop: 60 }}>Search and add products above</p>
                  : cartItems.map(item => (
                    <div key={item.product_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                      <div style={{ color: '#64748b', fontSize: 13 }}>Rs. {item.price}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => updateCartQty(item.product_id, item.qty - 1)} style={{ width: 26, height: 26, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer', fontWeight: 700 }}>-</button>
                        <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                        <button onClick={() => updateCartQty(item.product_id, item.qty + 1)} style={{ width: 26, height: 26, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer', fontWeight: 700 }}>+</button>
                      </div>
                      <div style={{ fontWeight: 700, minWidth: 80, textAlign: 'right' }}>Rs. {item.total?.toLocaleString()}</div>
                      <button onClick={() => removeFromCart(item.product_id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={15} color="#ef4444" /></button>
                    </div>
                  ))}
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Order Summary</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span style={{ color: '#64748b' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Discount (Rs.)</label>
                <input type="number" value={posForm.discount} onChange={e => setPosForm({ ...posForm, discount: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Tax (Rs.)</label>
                <input type="number" value={posForm.tax} onChange={e => setPosForm({ ...posForm, tax: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800 }}>
                  <span>TOTAL</span><span style={{ color: '#1e40af' }}>Rs. {total.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Payment Method</label>
                <select value={posForm.payment_method} onChange={e => setPosForm({ ...posForm, payment_method: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, background: '#fff' }}>
                  {['cash', 'card', 'bank_transfer', 'cheque', 'credit'].map(m => <option key={m} value={m}>{m.replace('_', ' ').toUpperCase()}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Amount Received</label>
                <input type="number" value={posForm.paid} onChange={e => setPosForm({ ...posForm, paid: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #3b82f6', borderRadius: 6, fontSize: 16, fontWeight: 700 }} />
              </div>
              {change >= 0 && parseFloat(posForm.paid) > 0 && (
                <div style={{ background: '#d1fae5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, textAlign: 'center', fontWeight: 700, color: '#065f46', fontSize: 16 }}>
                  Change: Rs. {change.toLocaleString()}
                </div>
              )}
              <button onClick={handleSale} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                Complete Sale ✓
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Invoice Modal */}
      {viewSale && (
        <Modal title={`Invoice: ${viewSale.invoice_no}`} onClose={() => setViewSale(null)}>
          {/* Invoice Header */}
          <div style={{ background: 'linear-gradient(135deg,#1e40af,#3b82f6)', borderRadius: 12, padding: '16px 20px', marginBottom: 16, color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>ProBiz ERP</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>House 124, Street 39, I-14/3, Islamabad</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>📞 0316-8818693</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 2 }}>INVOICE</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{viewSale.invoice_no}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{viewSale.created_at ? formatDate(viewSale.created_at) : '-'}</div>
              </div>
            </div>
          </div>

          {/* Customer & Payment Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 14px', borderLeft: '3px solid #1e40af' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Bill To</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{viewSale.customer?.name || 'Walk-in Customer'}</div>
              {viewSale.customer?.phone && <div style={{ fontSize: 12, color: '#64748b' }}>{viewSale.customer.phone}</div>}
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 14px', borderLeft: '3px solid #10b981' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Payment</div>
              <div style={{ fontWeight: 700, fontSize: 14, textTransform: 'capitalize' }}>{(viewSale.payment_method || '').replace('_', ' ')}</div>
              <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{viewSale.status?.toUpperCase()}</span>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
            <thead><tr style={{ background: '#1e40af', color: '#fff' }}>
              {['Product', 'Qty', 'Price', 'Total'].map(h => <th key={h} style={{ padding: '8px 12px', textAlign: h === 'Total' ? 'right' : 'left', fontWeight: 600, fontSize: 12 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {viewSale.items?.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding: '9px 12px', fontWeight: 600 }}>{item.product_name}</td>
                  <td style={{ padding: '9px 12px', color: '#64748b' }}>{item.quantity}</td>
                  <td style={{ padding: '9px 12px' }}>Rs. {item.unit_price?.toLocaleString()}</td>
                  <td style={{ padding: '9px 12px', fontWeight: 700, textAlign: 'right' }}>Rs. {item.total?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 4 }}>
            {viewSale.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}><span style={{ color: '#64748b' }}>Discount</span><span style={{ color: '#ef4444' }}>- Rs. {viewSale.discount?.toLocaleString()}</span></div>}
            {viewSale.tax > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}><span style={{ color: '#64748b' }}>Tax</span><span>Rs. {viewSale.tax?.toLocaleString()}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 18, background: '#1e40af', color: '#fff', borderRadius: 8, padding: '10px 14px', marginBottom: 8 }}>
              <span>TOTAL</span><span>Rs. {viewSale.total?.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, background: '#d1fae5', borderRadius: 8, padding: '8px 14px', color: '#065f46' }}>
              <span>✓ Paid</span><span>Rs. {viewSale.paid?.toLocaleString()}</span>
            </div>
            {viewSale.balance > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, background: '#fee2e2', borderRadius: 8, padding: '8px 14px', color: '#991b1b', marginTop: 6 }}><span>Balance Due</span><span>Rs. {viewSale.balance?.toLocaleString()}</span></div>}
          </div>

          {/* Print Button */}
          <PrintInvoice sale={viewSale} />
        </Modal>
      )}
    </div>
  );
}
