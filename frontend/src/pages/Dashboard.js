import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import API from '../api/client';
import { PageSpinner } from '../components/ui/Spinner';
import {
  TrendingUp, Package, Users, ShoppingCart, AlertTriangle,
  DollarSign, Truck, UserCheck, ArrowUpRight, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const fmt = (n) =>
  n >= 1000000 ? `Rs. ${(n / 1000000).toFixed(1)}M`
  : n >= 1000  ? `Rs. ${(n / 1000).toFixed(1)}K`
  : `Rs. ${n?.toFixed(0) || 0}`;

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

const STAT_CONFIG = (s) => [
  { icon: TrendingUp, label: "Today's Sales",  value: fmt(s?.today_sales),     sub: 'Completed transactions', iconCls: 'text-emerald-600', bgCls: 'bg-emerald-50', border: 'border-emerald-100' },
  { icon: DollarSign, label: 'Month Revenue',  value: fmt(s?.month_sales),     sub: 'This month',             iconCls: 'text-blue-600',    bgCls: 'bg-blue-50',    border: 'border-blue-100' },
  { icon: Package,    label: 'Total Products', value: s?.total_products,       sub: `${s?.low_stock_count} low stock`, iconCls: 'text-amber-600', bgCls: 'bg-amber-50', border: 'border-amber-100' },
  { icon: Users,      label: 'Customers',      value: s?.total_customers,      sub: `Rs. ${((s?.total_receivables||0)/1000).toFixed(0)}K receivable`, iconCls: 'text-violet-600', bgCls: 'bg-violet-50', border: 'border-violet-100' },
  { icon: Truck,      label: 'Suppliers',      value: s?.total_suppliers,      sub: `Rs. ${((s?.total_payables||0)/1000).toFixed(0)}K payable`, iconCls: 'text-red-500', bgCls: 'bg-red-50', border: 'border-red-100' },
  { icon: UserCheck,  label: 'Employees',      value: s?.total_employees,      sub: 'Active staff',           iconCls: 'text-sky-600',    bgCls: 'bg-sky-50',     border: 'border-sky-100' },
];

function StatCard({ icon: Icon, label, value, sub, iconCls, bgCls, border }) {
  return (
    <div className={`card border ${border} p-5 flex items-start gap-4 hover:shadow-md transition-shadow`}>
      <div className={`w-12 h-12 rounded-2xl ${bgCls} flex items-center justify-center shrink-0`}>
        <Icon size={22} className={iconCls} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900 leading-none">{value ?? '—'}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <ArrowUpRight size={14} className="text-gray-300 ml-auto shrink-0 mt-1" />
    </div>
  );
}

function SectionCard({ title, children, action }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats]           = useState(null);
  const [salesChart, setSalesChart] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock]     = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [s, sc, tp, ls, rs, mc] = await Promise.all([
        API.get('/api/dashboard/stats'),
        API.get('/api/dashboard/sales-chart'),
        API.get('/api/dashboard/top-products'),
        API.get('/api/dashboard/low-stock'),
        API.get('/api/dashboard/recent-sales'),
        API.get('/api/dashboard/monthly-comparison'),
      ]);
      setStats(s.data); setSalesChart(sc.data); setTopProducts(tp.data);
      setLowStock(ls.data); setRecentSales(rs.data); setMonthlyData(mc.data);
      if (silent) toast.success('Dashboard refreshed');
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <PageSpinner text="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Business overview and key metrics</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="btn-secondary text-xs"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CONFIG(stats).map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Area chart — 2/3 width */}
        <div className="lg:col-span-2">
          <SectionCard title="Sales — Last 7 Days">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesChart}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                  formatter={(v) => [`Rs. ${v?.toLocaleString()}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2.5} fill="url(#salesGrad)" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        {/* Pie chart — 1/3 width */}
        <SectionCard title="Top Products">
          {topProducts.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={topProducts} dataKey="revenue" cx="50%" cy="50%" outerRadius={65} innerRadius={30} paddingAngle={3}>
                    {topProducts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % 5]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `Rs. ${v?.toLocaleString()}`} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-2">
                {topProducts.slice(0, 4).map((p, i) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % 5] }} />
                    <span className="text-xs text-gray-500 flex-1 truncate">{p.name}</span>
                    <span className="text-xs font-semibold text-gray-800">Rs. {p.revenue?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No sales data yet</div>
          )}
        </SectionCard>
      </div>

      {/* Monthly bar + Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Sales vs Purchases — 6 Months">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barSize={14} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Bar dataKey="sales"     fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sales" />
              <Bar dataKey="purchases" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Purchases" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Recent Sales">
          <div className="overflow-x-auto -mx-5 -mb-5">
            <table className="w-full">
              <thead>
                <tr>
                  {['Invoice', 'Customer', 'Total', 'Status'].map(h => (
                    <th key={h} className="table-header first:pl-5 last:pr-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSales.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-400 text-sm">No recent sales</td></tr>
                ) : recentSales.map(s => (
                  <tr key={s.id} className="table-row">
                    <td className="table-cell pl-5 font-semibold text-blue-700">{s.invoice_no}</td>
                    <td className="table-cell max-w-[120px] truncate">{s.customer}</td>
                    <td className="table-cell font-semibold">Rs. {s.total?.toLocaleString()}</td>
                    <td className="table-cell pr-5">
                      <span className={s.status === 'completed' ? 'badge-green' : 'badge-red'}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="card border border-amber-100 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-amber-50 border-b border-amber-100">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="font-semibold text-amber-800 text-sm">Low Stock Alerts</h3>
            <span className="badge-yellow ml-1">{lowStock.length} items</span>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {lowStock.map(p => (
              <div key={p.id} className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="font-semibold text-sm text-gray-800 truncate mb-1">{p.name}</p>
                <p className="text-xs text-amber-700">
                  Stock: <span className="font-bold">{p.stock} {p.unit}</span>
                </p>
                <p className="text-xs text-gray-400">Min: {p.min_stock}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
