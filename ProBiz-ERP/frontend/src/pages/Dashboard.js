import React, { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API from '../api/client';
import { TrendingUp, Package, Users, ShoppingCart, AlertTriangle, DollarSign, Truck, UserCheck } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, color, bg }) => (
  <div style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
    <div style={{ width: 52, height: 52, background: bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={24} color={color} />
    </div>
    <div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

const fmt = (n) => n >= 1000000 ? `Rs. ${(n/1000000).toFixed(1)}M` : n >= 1000 ? `Rs. ${(n/1000).toFixed(1)}K` : `Rs. ${n?.toFixed(0) || 0}`;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [salesChart, setSalesChart] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/api/dashboard/stats'),
      API.get('/api/dashboard/sales-chart'),
      API.get('/api/dashboard/top-products'),
      API.get('/api/dashboard/low-stock'),
      API.get('/api/dashboard/recent-sales'),
      API.get('/api/dashboard/monthly-comparison'),
    ]).then(([s, sc, tp, ls, rs, mc]) => {
      setStats(s.data);
      setSalesChart(sc.data);
      setTopProducts(tp.data);
      setLowStock(ls.data);
      setRecentSales(rs.data);
      setMonthlyData(mc.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid #e2e8f0', borderTopColor: '#1e40af', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: '#64748b' }}>Loading dashboard...</p>
      </div>
    </div>
  );

  const statCards = [
    { icon: TrendingUp, label: "Today's Sales", value: fmt(stats?.today_sales), sub: 'Completed transactions', color: '#10b981', bg: '#d1fae5' },
    { icon: DollarSign, label: 'Month Revenue', value: fmt(stats?.month_sales), sub: 'This month', color: '#3b82f6', bg: '#dbeafe' },
    { icon: Package, label: 'Total Products', value: stats?.total_products, sub: `${stats?.low_stock_count} low stock alerts`, color: '#f59e0b', bg: '#fef3c7' },
    { icon: Users, label: 'Customers', value: stats?.total_customers, sub: `Rs. ${(stats?.total_receivables/1000).toFixed(0)}K receivable`, color: '#8b5cf6', bg: '#ede9fe' },
    { icon: Truck, label: 'Suppliers', value: stats?.total_suppliers, sub: `Rs. ${(stats?.total_payables/1000).toFixed(0)}K payable`, color: '#ef4444', bg: '#fee2e2' },
    { icon: UserCheck, label: 'Employees', value: stats?.total_employees, sub: 'Active staff', color: '#0ea5e9', bg: '#e0f2fe' },
  ];

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b' }}>Dashboard</h1>
        <p style={{ color: '#64748b', marginTop: 4 }}>Business overview and key metrics</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
        {statCards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Sales — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesChart}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip formatter={(v) => [`Rs. ${v.toLocaleString()}`, 'Sales']} />
              <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fill="url(#sg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Top Products</h3>
          {topProducts.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={topProducts} dataKey="revenue" cx="50%" cy="50%" outerRadius={70} label={false}>
                    {topProducts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              {topProducts.slice(0, 3).map((p, i) => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#475569', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>Rs. {p.revenue.toLocaleString()}</span>
                </div>
              ))}
            </>
          ) : <p style={{ color: '#94a3b8', textAlign: 'center', paddingTop: 60 }}>No sales data yet</p>}
        </div>
      </div>

      {/* Monthly comparison + tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Sales vs Purchases (6 Months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sales" />
              <Bar dataKey="purchases" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Purchases" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700 }}>Recent Sales</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['Invoice', 'Customer', 'Total', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#94a3b8', fontWeight: 600, fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSales.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '8px', color: '#1e40af', fontWeight: 600 }}>{s.invoice_no}</td>
                  <td style={{ padding: '8px', color: '#475569', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.customer}</td>
                  <td style={{ padding: '8px', fontWeight: 600 }}>Rs. {s.total?.toLocaleString()}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{ background: s.status === 'completed' ? '#d1fae5' : '#fee2e2', color: s.status === 'completed' ? '#065f46' : '#991b1b', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #fde68a', marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <h3 style={{ fontWeight: 700, color: '#92400e' }}>Low Stock Alerts</h3>
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{lowStock.length}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {lowStock.map(p => (
              <div key={p.id} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#92400e' }}>
                  Stock: <b>{p.stock} {p.unit}</b> | Min: {p.min_stock}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
