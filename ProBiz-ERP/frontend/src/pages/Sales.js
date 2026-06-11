import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { formatDate } from '../utils/dateFormat';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import Pagination, { usePagination } from '../components/ui/Pagination';
import { PageSpinner } from '../components/ui/Spinner';
import { exportCSV } from '../utils/csvExport';
import { Plus, Search, ShoppingCart, Trash2, Eye, Printer, Download, TrendingUp, DollarSign } from 'lucide-react';

// ─── Printable Invoice (unchanged logic) ──────────────────────────────────────
const PrintInvoice = ({ sale }) => {
  const printInvoice = () => {
    const printWindow = window.open('', '_blank');
    const content = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Invoice ${sale.invoice_no}</title>
      <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#1e293b;background:#fff}
      .page{width:210mm;min-height:297mm;margin:0 auto;padding:20mm}
      .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1e40af;padding-bottom:16px;margin-bottom:24px}
      .brand-name{font-size:28px;font-weight:900;color:#1e40af;letter-spacing:-1px}.brand-sub{font-size:12px;color:#64748b;margin-top:2px}.brand-contact{font-size:11px;color:#475569;margin-top:4px}
      .invoice-title{text-align:right}.invoice-title h2{font-size:32px;font-weight:900;color:#1e40af;letter-spacing:2px}.invoice-title .inv-no{font-size:14px;color:#475569;margin-top:4px;font-weight:700}.invoice-title .inv-date{font-size:12px;color:#64748b;margin-top:2px}
      .info-section{display:flex;justify-content:space-between;margin-bottom:24px;gap:24px}.info-box{flex:1;background:#f8fafc;border-radius:8px;padding:14px 16px;border-left:4px solid #1e40af}
      .info-box h4{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-bottom:6px}.info-box p{font-size:14px;font-weight:600;color:#1e293b;margin-bottom:2px}.info-box span{font-size:12px;color:#64748b}
      table{width:100%;border-collapse:collapse;margin-bottom:24px}thead tr{background:#1e40af;color:#fff}thead th{padding:10px 14px;text-align:left;font-size:12px;font-weight:700;letter-spacing:.5px}thead th:last-child{text-align:right}
      tbody tr{border-bottom:1px solid #f1f5f9}tbody tr:nth-child(even){background:#f8fafc}tbody td{padding:10px 14px;font-size:13px}tbody td:last-child{text-align:right;font-weight:700}
      .totals{display:flex;justify-content:flex-end;margin-bottom:24px}.totals-box{width:260px}
      .totals-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px solid #f1f5f9}.totals-row span:first-child{color:#64748b}
      .total-final{display:flex;justify-content:space-between;padding:12px 14px;background:#1e40af;color:#fff;border-radius:8px;font-size:18px;font-weight:900;margin-top:6px}
      .paid-row{display:flex;justify-content:space-between;padding:8px 14px;background:#d1fae5;border-radius:8px;font-size:14px;font-weight:700;color:#065f46;margin-top:6px}
      .change-row{display:flex;justify-content:space-between;padding:8px 14px;background:#fff7ed;border-radius:8px;font-size:14px;font-weight:700;color:#92400e;margin-top:4px}
      .footer{text-align:center;border-top:2px solid #e2e8f0;padding-top:16px;font-size:12px;color:#94a3b8}
      .footer strong{color:#1e40af}.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:#d1fae5;color:#065f46}
      @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.page{padding:10mm}}</style></head>
      <body><div class="page">
      <div class="header"><div><div class="brand-name">ProBiz ERP</div><div class="brand-sub">Advanced Pharmacy & Business Management</div><div class="brand-contact">📍 House 124, Street 39, I-14/3, Islamabad</div><div class="brand-contact">📞 0316-8818693 &nbsp;|&nbsp; ✉️ raees.malik89@gmail.com</div></div>
      <div class="invoice-title"><h2>INVOICE</h2><div class="inv-no">${sale.invoice_no}</div><div class="inv-date">${new Date(new Date(sale.created_at).getTime() + 5*60*60*1000).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</div><div style="margin-top:6px"><span class="badge">${(sale.status || 'completed').toUpperCase()}</span></div></div></div>
      <div class="info-section"><div class="info-box"><h4>Bill To</h4><p>${sale.customer?.name || 'Walk-in Customer'}</p>${sale.customer?.phone ? `<span>📞 ${sale.customer.phone}</span>` : ''}${sale.customer?.city ? `<br/><span>📍 ${sale.customer.city}</span>` : ''}</div>
      <div class="info-box"><h4>Payment Info</h4><p>${(sale.payment_method || 'Cash').replace('_', ' ').toUpperCase()}</p><span>Date: ${new Date(new Date(sale.created_at).getTime() + 5*60*60*1000).toLocaleDateString('en-PK')}</span><br/><span>Time: ${new Date(new Date(sale.created_at).getTime() + 5*60*60*1000).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true })}</span></div></div>
      <table><thead><tr><th>#</th><th>Product</th><th>Batch No.</th><th>Expiry</th><th>Unit Price</th><th>Qty</th>${sale.items?.some(i => i.discount > 0) ? '<th>Disc.</th>' : ''}<th>Total</th></tr></thead>
      <tbody>${sale.items?.map((item, i) => `<tr><td style="color:#94a3b8">${i + 1}</td><td><strong>${item.product_name}</strong></td><td style="color:#475569">${item.batch_no || '—'}</td><td style="color:${item.expiry_date ? '#dc2626' : '#475569'}">${item.expiry_date || '—'}</td><td>Rs. ${item.unit_price?.toLocaleString()}</td><td>${item.quantity}</td>${sale.items?.some(i => i.discount > 0) ? `<td>Rs. ${item.discount?.toLocaleString() || 0}</td>` : ''}<td>Rs. ${item.total?.toLocaleString()}</td></tr>`).join('')}</tbody></table>
      <div class="totals"><div class="totals-box"><div class="totals-row"><span>Subtotal</span><span>Rs. ${sale.subtotal?.toLocaleString()}</span></div>${sale.discount > 0 ? `<div class="totals-row"><span>Discount</span><span style="color:#ef4444">- Rs. ${sale.discount?.toLocaleString()}</span></div>` : ''}${sale.tax > 0 ? `<div class="totals-row"><span>Tax</span><span>Rs. ${sale.tax?.toLocaleString()}</span></div>` : ''}
      <div class="total-final"><span>TOTAL</span><span>Rs. ${sale.total?.toLocaleString()}</span></div><div class="paid-row"><span>✓ Paid</span><span>Rs. ${sale.paid?.toLocaleString()}</span></div>${(sale.balance || 0) > 0 ? `<div class="change-row"><span>Balance Due</span><span>Rs. ${sale.balance?.toLocaleString()}</span></div>` : ''}${(sale.paid - sale.total) > 0 ? `<div class="change-row"><span>Change</span><span>Rs. ${(sale.paid - sale.total)?.toLocaleString()}</span></div>` : ''}</div></div>
      <div style="display:flex;justify-content:space-between;margin-top:32px;margin-bottom:24px;gap:24px">${['Pharmacist Signature','Manager Signature','Customer Signature'].map(s => `<div style="flex:1;text-align:center"><div style="border-top:2px solid #1e40af;padding-top:8px;margin-top:40px"><div style="font-size:13px;font-weight:700;color:#1e293b">${s}</div><div style="font-size:11px;color:#64748b;margin-top:2px">${s === 'Pharmacist Signature' ? 'Licensed Pharmacist' : s === 'Manager Signature' ? 'Authorized Signatory' : 'Received By'}</div></div></div>`).join('')}</div>
      <div class="footer"><p>Thank you for your business! &nbsp;|&nbsp; <strong>ProBiz ERP</strong> &nbsp;|&nbsp; probiz-erp-poru.vercel.app</p><p style="margin-top:4px;font-size:10px">Computer-generated invoice. Valid subject to authorized signatures above.</p></div>
      </div><script>window.onload=()=>window.print()</script></body></html>`;
    printWindow.document.write(content);
    printWindow.document.close();
  };
  return (
    <button onClick={printInvoice} className="btn-primary w-full justify-center mt-4">
      <Printer size={15} /> Print / Save as PDF
    </button>
  );
};

export default function Sales() {
  const [sales, setSales]                       = useState([]);
  const [customers, setCustomers]               = useState([]);
  const [products, setProducts]                 = useState([]);
  const [search, setSearch]                     = useState('');
  const [loading, setLoading]                   = useState(true);
  const [showPOS, setShowPOS]                   = useState(false);
  const [viewSale, setViewSale]                 = useState(null);
  const [cartItems, setCartItems]               = useState([]);
  const [posForm, setPosForm]                   = useState({ customer_id: '', discount: 0, tax: 0, paid: 0, payment_method: 'cash' });
  const [productSearch, setProductSearch]       = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const setPos = (k, v) => setPosForm(f => ({ ...f, [k]: v }));

  const { page, setPage, paginated, total, pageSize } = usePagination(sales, 20);

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
    if (productSearch.length > 1)
      setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || (p.barcode && p.barcode.includes(productSearch))));
    else setFilteredProducts([]);
  }, [productSearch, products]);

  const addToCart = (product) => {
    const existing = cartItems.find(i => i.product_id === product.id);
    if (existing) setCartItems(cartItems.map(i => i.product_id === product.id ? { ...i, qty: i.qty + 1, total: (i.qty + 1) * i.price } : i));
    else setCartItems([...cartItems, { product_id: product.id, name: product.name, price: product.sale_price, qty: 1, total: product.sale_price, discount: 0 }]);
    setProductSearch(''); setFilteredProducts([]);
  };

  const removeFromCart = (id) => setCartItems(cartItems.filter(i => i.product_id !== id));
  const updateQty = (id, qty) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCartItems(cartItems.map(i => i.product_id === id ? { ...i, qty, total: qty * i.price - i.discount } : i));
  };

  const subtotal = cartItems.reduce((s, i) => s + i.total, 0);
  const total2   = subtotal - parseFloat(posForm.discount || 0) + parseFloat(posForm.tax || 0);
  const change   = parseFloat(posForm.paid || 0) - total2;

  const handleSale = async () => {
    if (cartItems.length === 0) { toast.error('Add at least one product'); return; }
    try {
      const res = await API.post('/api/sales/', {
        customer_id: posForm.customer_id || null,
        items: cartItems.map(i => ({ product_id: i.product_id, quantity: i.qty, unit_price: i.price, discount: i.discount || 0 })),
        discount: parseFloat(posForm.discount) || 0, tax: parseFloat(posForm.tax) || 0,
        paid: parseFloat(posForm.paid) || total2, payment_method: posForm.payment_method,
      });
      toast.success('Sale completed!');
      setShowPOS(false); setCartItems([]);
      setPosForm({ customer_id: '', discount: 0, tax: 0, paid: 0, payment_method: 'cash' });
      const detail = await API.get(`/api/sales/${res.data.id}`);
      setViewSale(detail.data); load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
  };

  const todaySales = sales.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString());
  const todayTotal = todaySales.reduce((s, i) => s + (i.total || 0), 0);

  if (loading) return <PageSpinner text="Loading sales..." />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Sales & POS</h1>
          <p className="page-subtitle">Process sales and manage invoices</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(sales.map(s => ({ Invoice: s.invoice_no, Customer: s.customer, Total: s.total, Paid: s.paid, Balance: s.balance, Payment: s.payment_method, Status: s.status, Date: s.created_at })), 'sales.csv')} className="btn-secondary text-xs">
            <Download size={13} /> Export
          </button>
          <button onClick={() => setShowPOS(true)} className="btn-primary text-xs">
            <Plus size={14} /> New Sale
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Today's Sales", value: todaySales.length, icon: ShoppingCart, iconCls: 'text-blue-600', bgCls: 'bg-blue-50' },
          { label: "Today's Revenue", value: `Rs. ${todayTotal.toLocaleString()}`, icon: TrendingUp, iconCls: 'text-emerald-600', bgCls: 'bg-emerald-50' },
          { label: 'Total Invoices', value: sales.length, icon: DollarSign, iconCls: 'text-violet-600', bgCls: 'bg-violet-50' },
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
            <input className="input pl-8 text-sm" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>{['Invoice No', 'Customer', 'Items', 'Total', 'Paid', 'Balance', 'Payment', 'Status', 'Date', ''].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-12 text-gray-400"><ShoppingCart size={36} className="mx-auto mb-2 opacity-30" />No sales yet</td></tr>
              ) : paginated.map(s => (
                <tr key={s.id} className="table-row">
                  <td className="table-cell font-bold text-blue-700">{s.invoice_no}</td>
                  <td className="table-cell">{s.customer}</td>
                  <td className="table-cell text-gray-500">{s.items_count}</td>
                  <td className="table-cell font-bold">Rs. {s.total?.toLocaleString()}</td>
                  <td className="table-cell font-semibold text-emerald-600">Rs. {s.paid?.toLocaleString()}</td>
                  <td className="table-cell font-bold"><span className={s.balance > 0 ? 'text-red-500' : 'text-emerald-600'}>Rs. {s.balance?.toLocaleString()}</span></td>
                  <td className="table-cell"><span className="badge-gray capitalize">{s.payment_method}</span></td>
                  <td className="table-cell"><span className={s.status === 'completed' ? 'badge-green' : 'badge-red'}>{s.status}</span></td>
                  <td className="table-cell text-xs text-gray-500">{s.created_at ? formatDate(s.created_at) : '—'}</td>
                  <td className="table-cell">
                    <button onClick={async () => { const r = await API.get(`/api/sales/${s.id}`); setViewSale(r.data); }} className="flex items-center gap-1 px-2 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs text-blue-600 font-medium transition-colors">
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

      {/* POS Modal */}
      {showPOS && (
        <Modal title="New Sale — Point of Sale" onClose={() => setShowPOS(false)} size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
            {/* Left: product search + cart */}
            <div className="space-y-3">
              <select className="input text-sm" value={posForm.customer_id} onChange={e => setPos('customer_id', e.target.value)}>
                <option value="">Walk-in Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
              </select>
              <div className="relative">
                <input className="input text-sm" value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search product by name or barcode..." />
                {filteredProducts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl z-20 max-h-56 overflow-y-auto shadow-xl mt-1">
                    {filteredProducts.map(p => (
                      <div key={p.id} onClick={() => addToCart(p)} className="flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                          <p className="text-xs text-gray-400">Stock: {p.stock} {p.unit}</p>
                        </div>
                        <span className="font-bold text-emerald-600 text-sm">Rs. {p.sale_price?.toLocaleString()}</span>
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
                    <span className="text-xs text-gray-500">Rs. {item.price}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.product_id, item.qty - 1)} className="w-6 h-6 border border-gray-200 rounded-md bg-white text-sm font-bold hover:bg-gray-100">-</button>
                      <span className="w-7 text-center text-sm font-bold">{item.qty}</span>
                      <button onClick={() => updateQty(item.product_id, item.qty + 1)} className="w-6 h-6 border border-gray-200 rounded-md bg-white text-sm font-bold hover:bg-gray-100">+</button>
                    </div>
                    <span className="font-bold text-sm min-w-[70px] text-right">Rs. {item.total?.toLocaleString()}</span>
                    <button onClick={() => removeFromCart(item.product_id)}><Trash2 size={14} className="text-red-400 hover:text-red-600" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: order summary */}
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-gray-800">Order Summary</h4>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-semibold">Rs. {subtotal.toLocaleString()}</span></div>
              {[['Discount (Rs.)', 'discount'], ['Tax (Rs.)', 'tax']].map(([label, key]) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input type="number" className="input text-sm" value={posForm[key]} onChange={e => setPos(key, e.target.value)} />
                </div>
              ))}
              <div className="flex justify-between py-3 border-t border-gray-200 text-lg font-extrabold">
                <span>TOTAL</span><span className="text-blue-700">Rs. {total2.toLocaleString()}</span>
              </div>
              <div>
                <label className="label">Payment Method</label>
                <select className="input text-sm" value={posForm.payment_method} onChange={e => setPos('payment_method', e.target.value)}>
                  {['cash', 'card', 'bank_transfer', 'cheque', 'credit'].map(m => <option key={m} value={m}>{m.replace('_', ' ').toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Amount Received</label>
                <input type="number" className="input text-sm font-bold text-base border-blue-400 focus:ring-blue-500" value={posForm.paid} onChange={e => setPos('paid', e.target.value)} />
              </div>
              {change >= 0 && parseFloat(posForm.paid) > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-center font-bold text-emerald-700">
                  Change: Rs. {change.toLocaleString()}
                </div>
              )}
              <button onClick={handleSale} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-base transition-colors">
                Complete Sale ✓
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Invoice Modal */}
      {viewSale && (
        <Modal title={`Invoice: ${viewSale.invoice_no}`} onClose={() => setViewSale(null)} size="md">
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl p-4 mb-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xl font-extrabold">ProBiz ERP</p>
                <p className="text-xs opacity-75">House 124, Street 39, I-14/3, Islamabad</p>
                <p className="text-xs opacity-75">📞 0316-8818693</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-60 tracking-widest">INVOICE</p>
                <p className="text-base font-bold">{viewSale.invoice_no}</p>
                <p className="text-xs opacity-75">{viewSale.created_at ? formatDate(viewSale.created_at) : '—'}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-600">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bill To</p>
              <p className="font-bold text-sm">{viewSale.customer?.name || 'Walk-in Customer'}</p>
              {viewSale.customer?.phone && <p className="text-xs text-gray-500">{viewSale.customer.phone}</p>}
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-emerald-500">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Payment</p>
              <p className="font-bold text-sm capitalize">{(viewSale.payment_method || '').replace('_', ' ')}</p>
              <span className={viewSale.status === 'completed' ? 'badge-green' : 'badge-red'}>{viewSale.status?.toUpperCase()}</span>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-100 mb-4">
            <table className="w-full text-sm">
              <thead><tr className="bg-blue-800 text-white">{['Product', 'Qty', 'Price', 'Total'].map(h => <th key={h} className={`px-3 py-2 text-xs font-semibold ${h === 'Total' ? 'text-right' : 'text-left'}`}>{h}</th>)}</tr></thead>
              <tbody>
                {viewSale.items?.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 font-semibold">{item.product_name}</td>
                    <td className="px-3 py-2 text-gray-500">{item.quantity}</td>
                    <td className="px-3 py-2">Rs. {item.unit_price?.toLocaleString()}</td>
                    <td className="px-3 py-2 font-bold text-right">Rs. {item.total?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {viewSale.discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span className="text-red-500 font-semibold">- Rs. {viewSale.discount?.toLocaleString()}</span></div>}
            {viewSale.tax > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Tax</span><span>Rs. {viewSale.tax?.toLocaleString()}</span></div>}
            <div className="flex justify-between items-center bg-blue-800 text-white rounded-xl px-4 py-3 text-lg font-extrabold">
              <span>TOTAL</span><span>Rs. {viewSale.total?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-700">
              <span>✓ Paid</span><span>Rs. {viewSale.paid?.toLocaleString()}</span>
            </div>
            {viewSale.balance > 0 && <div className="flex justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600"><span>Balance Due</span><span>Rs. {viewSale.balance?.toLocaleString()}</span></div>}
          </div>
          <PrintInvoice sale={viewSale} />
        </Modal>
      )}
    </div>
  );
}
