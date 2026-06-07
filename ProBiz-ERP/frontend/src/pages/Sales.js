import React, { useEffect, useState } from 'react';
import API from '../api/client';
import toast from 'react-hot-toast';
import { Plus, Search, ShoppingCart, Trash2, X, Eye } from 'lucide-react';

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
      await API.post('/api/sales/', {
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
                  <td style={{ padding: '11px 14px', color: '#64748b', fontSize: 12 }}>{s.created_at ? new Date(s.created_at).toLocaleDateString('en-PK') : '-'}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <button onClick={async () => { const r = await API.get(`/api/sales/${s.id}`); setViewSale(r.data); }} style={{ padding: '5px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}><Eye size={14} color="#3b82f6" /></button>
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

            {/* Order summary */}
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

      {/* View sale modal */}
      {viewSale && (
        <Modal title={`Invoice: ${viewSale.invoice_no}`} onClose={() => setViewSale(null)}>
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
              <span style={{ color: '#64748b' }}>Customer</span><span style={{ fontWeight: 600 }}>{viewSale.customer?.name || 'Walk-in'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
              <span style={{ color: '#64748b' }}>Date</span><span>{viewSale.created_at ? new Date(viewSale.created_at).toLocaleString('en-PK') : '-'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#64748b' }}>Payment</span><span style={{ textTransform: 'capitalize' }}>{viewSale.payment_method}</span>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
            <thead><tr style={{ background: '#f1f5f9' }}>
              {['Product', 'Qty', 'Price', 'Total'].map(h => <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {viewSale.items?.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px' }}>{item.product_name}</td>
                  <td style={{ padding: '8px 12px' }}>{item.quantity}</td>
                  <td style={{ padding: '8px 12px' }}>Rs. {item.unit_price?.toLocaleString()}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>Rs. {item.total?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16 }}>
            {[['Subtotal', viewSale.subtotal], ['Discount', viewSale.discount], ['Tax', viewSale.tax]].map(([l, v]) => v > 0 && (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>{l}</span><span>Rs. {v?.toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 17, borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
              <span>TOTAL</span><span style={{ color: '#1e40af' }}>Rs. {viewSale.total?.toLocaleString()}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
