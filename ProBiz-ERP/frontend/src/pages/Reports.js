import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, TrendingUp, Package, Users } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#0ea5e9'];

export default function Reports() {
  const [tab, setTab] = useState('sales');
  const [salesChart, setSalesChart] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      API.get('/api/dashboard/sales-chart'),
      API.get('/api/dashboard/monthly-comparison'),
      API.get('/api/dashboard/top-products'),
      API.get('/api/dashboard/stats'),
    ]).then(([sc, mc, tp, s]) => {
      setSalesChart(sc.data);
      setMonthlyData(mc.data);
      setTopProducts(tp.data);
      setStats(s.data);
    });
  }, []);

  const tabs = [
    { id: 'sales', label: 'Sales Report', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'comparison', label: 'Monthly Comparison', icon: BarChart3 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Reports & Analytics</h1>
        <p style={{ color: '#64748b', marginTop: 2 }}>Detailed business insights and data visualization</p>
      </div>

      {/* KPI Summary */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            ["Today's Sales", `Rs. ${stats.today_sales?.toLocaleString()}`, '#10b981'],
            ["Month Revenue", `Rs. ${stats.month_sales?.toLocaleString()}`, '#3b82f6'],
            ["Month Purchases", `Rs. ${stats.month_purchases?.toLocaleString()}`, '#f59e0b'],
            ["Gross Profit", `Rs. ${(stats.month_sales - stats.month_purchases).toLocaleString()}`, stats.month_sales > stats.month_purchases ? '#10b981' : '#ef4444'],
          ].map(([label, value, color]) => (
            <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 10, marginBottom: 24, width: 'fit-content' }}>
        {tabs.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', background: tab === id ? '#fff' : 'transparent', color: tab === id ? '#1e40af' : '#64748b', boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>{label}</button>
        ))}
      </div>

      {tab === 'sales' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Daily Sales — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={salesChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 13, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 13, fill: '#94a3b8' }} />
                <Tooltip formatter={(v) => [`Rs. ${v.toLocaleString()}`, 'Sales']} />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Top Products by Revenue</h3>
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                      {topProducts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p style={{ textAlign: 'center', color: '#94a3b8', paddingTop: 80 }}>No data</p>}
            </div>

            <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Revenue Split</h3>
              {topProducts.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={topProducts} dataKey="revenue" cx="50%" cy="50%" outerRadius={80}>
                        {topProducts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ marginTop: 12 }}>
                    {topProducts.map((p, i) => (
                      <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                        <span style={{ flex: 1, color: '#475569' }}>{p.name}</span>
                        <span style={{ fontWeight: 700 }}>Rs. {p.revenue?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <p style={{ textAlign: 'center', color: '#94a3b8', paddingTop: 80 }}>No data</p>}
            </div>
          </div>
        </div>
      )}

      {tab === 'comparison' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Sales vs Purchases — Last 6 Months</h3>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 13, fill: '#94a3b8' }} />
              <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Sales" barSize={28} />
              <Bar dataKey="purchases" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Purchases" barSize={28} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {monthlyData.map(m => (
              <div key={m.month} style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: '#1e293b' }}>{m.month}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Sales: <b style={{ color: '#3b82f6' }}>Rs. {m.sales?.toLocaleString()}</b></div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Purchases: <b style={{ color: '#f59e0b' }}>Rs. {m.purchases?.toLocaleString()}</b></div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Profit: <b style={{ color: m.sales > m.purchases ? '#10b981' : '#ef4444' }}>Rs. {(m.sales - m.purchases).toLocaleString()}</b></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'inventory' && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Inventory Summary</h3>
            {[
              ['Total Products', stats.total_products, '#3b82f6'],
              ['Low Stock Alerts', stats.low_stock_count, '#ef4444'],
              ['Total Customers', stats.total_customers, '#10b981'],
              ['Total Suppliers', stats.total_suppliers, '#8b5cf6'],
              ['Total Employees', stats.total_employees, '#f59e0b'],
            ].map(([label, value, color]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontSize: 15 }}>{label}</span>
                <span style={{ fontWeight: 700, color, fontSize: 16 }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Financial Position</h3>
            {[
              ['Total Receivables', `Rs. ${stats.total_receivables?.toLocaleString()}`, '#10b981'],
              ['Total Payables', `Rs. ${stats.total_payables?.toLocaleString()}`, '#ef4444'],
              ['Net Position', `Rs. ${(stats.total_receivables - stats.total_payables).toLocaleString()}`, stats.total_receivables > stats.total_payables ? '#10b981' : '#ef4444'],
            ].map(([label, value, color]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontSize: 15 }}>{label}</span>
                <span style={{ fontWeight: 800, color, fontSize: 18 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
