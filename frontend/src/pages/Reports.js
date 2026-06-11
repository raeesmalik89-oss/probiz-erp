import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, TrendingUp, Package, DollarSign, Printer, FileText } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#0ea5e9'];

export default function Reports() {
  const [tab, setTab] = useState('summary');
  const [salesChart, setSalesChart] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [salesList, setSalesList] = useState([]);
  const [purchasesList, setPurchasesList] = useState([]);
  const [fromDate, setFromDate] = useState(() => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0,10); });
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0,10));
  const [summaryLoading, setSummaryLoading] = useState(false);

  const pkt = (utcStr) => {
    if (!utcStr) return '-';
    const d = new Date(new Date(utcStr).getTime() + 5*60*60*1000);
    return d.toLocaleDateString('en-PK');
  };

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

  const loadSummary = async () => {
    setSummaryLoading(true);
    try {
      const [sRes, pRes] = await Promise.all([
        API.get('/api/sales/', { params: { from_date: fromDate, to_date: toDate, limit: 200 } }),
        API.get('/api/purchases/', { params: { from_date: fromDate, to_date: toDate, limit: 200 } }),
      ]);
      setSalesList(sRes.data.sales || []);
      setPurchasesList(pRes.data.purchases || []);
    } finally { setSummaryLoading(false); }
  };

  useEffect(() => { loadSummary(); }, [fromDate, toDate]);

  const printSummary = () => {
    const totalSales = salesList.reduce((s, i) => s + (i.total || 0), 0);
    const totalPurchases = purchasesList.reduce((s, i) => s + (i.total || 0), 0);
    const profit = totalSales - totalPurchases;
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Summary Report</title>
    <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#1e293b;font-size:13px}
    .page{width:210mm;min-height:297mm;margin:0 auto;padding:15mm}
    .header{border-bottom:3px solid #1e40af;padding-bottom:14px;margin-bottom:20px;display:flex;justify-content:space-between}
    .brand{font-size:24px;font-weight:900;color:#1e40af}.sub{font-size:11px;color:#64748b;margin-top:2px}
    .kpi{display:flex;gap:12px;margin-bottom:20px}
    .kpi-box{flex:1;border-radius:8px;padding:14px;text-align:center}
    .kpi-val{font-size:18px;font-weight:900;margin-bottom:2px}.kpi-lbl{font-size:10px;color:#64748b}
    h3{font-size:13px;font-weight:800;background:#1e40af;color:#fff;padding:7px 12px;border-radius:6px 6px 0 0;margin-top:16px}
    table{width:100%;border-collapse:collapse;margin-bottom:4px}
    th{background:#f1f5f9;padding:7px 10px;text-align:left;font-size:11px;font-weight:700;color:#475569}
    th:last-child,td:last-child{text-align:right}
    td{padding:7px 10px;border-bottom:1px solid #f8fafc;font-size:12px}
    tr:nth-child(even) td{background:#fafafa}
    .tfoot td{font-weight:800;background:#f1f5f9;border-top:2px solid #e2e8f0}
    .profit-box{display:flex;justify-content:flex-end;margin-top:16px}
    .profit-inner{width:260px;border-radius:8px;overflow:hidden}
    .pr{display:flex;justify-content:space-between;padding:9px 14px;font-size:13px;border-bottom:1px solid #e2e8f0}
    .pr-final{display:flex;justify-content:space-between;padding:11px 14px;font-size:16px;font-weight:900;background:#1e40af;color:#fff}
    .footer{text-align:center;border-top:2px solid #e2e8f0;padding-top:12px;font-size:10px;color:#94a3b8;margin-top:20px}
    @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head>
    <body><div class="page">
    <div class="header">
      <div><div class="brand">ProBiz ERP</div><div class="sub">Advanced Pharmacy & Business Management</div><div class="sub">📍 House 124, Street 39, I-14/3, Islamabad &nbsp;|&nbsp; 📞 0316-8818693</div></div>
      <div style="text-align:right"><div style="font-size:20px;font-weight:900;color:#1e40af">SUMMARY REPORT</div><div style="font-size:11px;color:#64748b;margin-top:4px">Period: ${fromDate} to ${toDate}</div><div style="font-size:11px;color:#64748b">Generated: ${new Date(Date.now()+5*3600000).toLocaleString('en-PK')}</div></div>
    </div>
    <div class="kpi">
      <div class="kpi-box" style="background:#dbeafe"><div class="kpi-val" style="color:#1e40af">Rs. ${totalSales.toLocaleString()}</div><div class="kpi-lbl">Total Sales (${salesList.length} invoices)</div></div>
      <div class="kpi-box" style="background:#fef3c7"><div class="kpi-val" style="color:#d97706">Rs. ${totalPurchases.toLocaleString()}</div><div class="kpi-lbl">Total Purchases (${purchasesList.length} orders)</div></div>
      <div class="kpi-box" style="background:${profit>=0?'#d1fae5':'#fee2e2'}"><div class="kpi-val" style="color:${profit>=0?'#065f46':'#991b1b'}">Rs. ${profit.toLocaleString()}</div><div class="kpi-lbl">${profit>=0?'Gross Profit':'Net Loss'}</div></div>
    </div>
    <h3>📦 SALES DETAIL</h3>
    <table><thead><tr><th>#</th><th>Invoice No</th><th>Customer</th><th>Date</th><th>Payment</th><th>Status</th><th>Total</th></tr></thead>
    <tbody>${salesList.map((s,i)=>`<tr><td style="color:#94a3b8">${i+1}</td><td style="color:#1e40af;font-weight:700">${s.invoice_no}</td><td>${s.customer||'Walk-in'}</td><td>${pkt(s.created_at)}</td><td>${(s.payment_method||'').replace('_',' ')}</td><td>${s.status||''}</td><td>Rs. ${(s.total||0).toLocaleString()}</td></tr>`).join('')}
    <tr class="tfoot"><td colspan="6" style="text-align:right;padding-right:10px">TOTAL SALES</td><td>Rs. ${totalSales.toLocaleString()}</td></tr>
    </tbody></table>
    <h3>🛒 PURCHASES DETAIL</h3>
    <table><thead><tr><th>#</th><th>PO Number</th><th>Supplier</th><th>Date</th><th>Payment</th><th>Status</th><th>Total</th></tr></thead>
    <tbody>${purchasesList.map((p,i)=>`<tr><td style="color:#94a3b8">${i+1}</td><td style="color:#1e40af;font-weight:700">${p.po_number}</td><td>${p.supplier||''}</td><td>${pkt(p.created_at)}</td><td>${(p.payment_method||'').replace('_',' ')}</td><td>${p.status||''}</td><td>Rs. ${(p.total||0).toLocaleString()}</td></tr>`).join('')}
    <tr class="tfoot"><td colspan="6" style="text-align:right;padding-right:10px">TOTAL PURCHASES</td><td>Rs. ${totalPurchases.toLocaleString()}</td></tr>
    </tbody></table>
    <div class="profit-box"><div class="profit-inner">
      <div class="pr"><span>Total Sales</span><span style="color:#10b981;font-weight:700">Rs. ${totalSales.toLocaleString()}</span></div>
      <div class="pr"><span>Total Purchases</span><span style="color:#ef4444;font-weight:700">Rs. ${totalPurchases.toLocaleString()}</span></div>
      <div class="pr-final"><span>${profit>=0?'GROSS PROFIT':'NET LOSS'}</span><span>Rs. ${profit.toLocaleString()}</span></div>
    </div></div>
    <div class="footer"><p>ProBiz ERP &nbsp;|&nbsp; probiz-erp-poru.vercel.app &nbsp;|&nbsp; Confidential — Superadmin Report</p></div>
    </div><script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  };

  const tabs = [
    { id: 'summary', label: 'Summary Report', icon: FileText },
    { id: 'profit', label: 'Profit & Loss', icon: DollarSign },
    { id: 'sales', label: 'Sales Chart', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'comparison', label: 'Monthly', icon: BarChart3 },
  ];

  const printPL = () => {
    if (!stats) return;
    const revenue = stats.month_sales || 0;
    const cogs = stats.month_purchases || 0;
    const grossProfit = revenue - cogs;
    const grossMargin = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : 0;
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Profit & Loss Report</title>
    <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#1e293b}
    .page{width:210mm;min-height:297mm;margin:0 auto;padding:12mm 16mm}
    .header{border-bottom:3px solid #1e40af;padding-bottom:10px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center}
    .brand{font-size:22px;font-weight:900;color:#1e40af}.sub{font-size:10px;color:#64748b;margin-top:2px}
    .title{text-align:right}.title h2{font-size:20px;font-weight:900;color:#1e40af;line-height:1.2}
    .title p{font-size:11px;color:#64748b;margin-top:3px}
    .section{margin-bottom:16px}.section h3{font-size:13px;font-weight:700;background:#1e40af;color:#fff;padding:6px 12px;border-radius:6px;margin-bottom:0}
    .row{display:flex;justify-content:space-between;padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px}
    .row:nth-child(even){background:#f8fafc}
    .row-total{display:flex;justify-content:space-between;padding:10px 12px;font-size:14px;font-weight:800;background:#1e40af;color:#fff;border-radius:0 0 6px 6px;margin-bottom:12px}
    .profit{color:#10b981}.loss{color:#ef4444}
    .kpi{display:flex;gap:12px;margin-bottom:16px}
    .kpi-box{flex:1;border-radius:8px;padding:12px;text-align:center}
    .kpi-box .val{font-size:18px;font-weight:900;margin-bottom:3px}
    .kpi-box .lbl{font-size:10px;color:#64748b}
    .footer{text-align:center;border-top:2px solid #e2e8f0;padding-top:10px;font-size:10px;color:#94a3b8;margin-top:16px}
    @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head>
    <body><div class="page">
    <div class="header">
      <div><div class="brand">ProBiz ERP</div><div class="sub">Advanced Pharmacy & Business Management</div><div class="sub">House 124, Street 39, I-14/3, Islamabad &nbsp;|&nbsp; 0316-8818693</div></div>
      <div class="title"><h2>PROFIT & LOSS<br/>STATEMENT</h2><p>This Month &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
    </div>
    <div class="kpi">
      <div class="kpi-box" style="background:#dbeafe"><div class="val" style="color:#1e40af">Rs. ${revenue.toLocaleString()}</div><div class="lbl">Total Revenue</div></div>
      <div class="kpi-box" style="background:#fef3c7"><div class="val" style="color:#d97706">Rs. ${cogs.toLocaleString()}</div><div class="lbl">Cost of Goods</div></div>
      <div class="kpi-box" style="background:${grossProfit >= 0 ? '#d1fae5' : '#fee2e2'}"><div class="val" style="color:${grossProfit >= 0 ? '#065f46' : '#991b1b'}">Rs. ${grossProfit.toLocaleString()}</div><div class="lbl">Gross Profit</div></div>
      <div class="kpi-box" style="background:#f0fdf4"><div class="val" style="color:#16a34a">${grossMargin}%</div><div class="lbl">Profit Margin</div></div>
    </div>
    <div class="section">
      <h3>📈 INCOME</h3>
      <div class="row"><span>Sales Revenue (This Month)</span><span class="profit">Rs. ${revenue.toLocaleString()}</span></div>
      <div class="row"><span>Today's Sales</span><span class="profit">Rs. ${(stats.today_sales || 0).toLocaleString()}</span></div>
      <div class="row-total"><span>TOTAL INCOME</span><span>Rs. ${revenue.toLocaleString()}</span></div>
    </div>
    <div class="section">
      <h3>📦 COST OF GOODS SOLD</h3>
      <div class="row"><span>Purchases / Stock Cost (This Month)</span><span class="loss">Rs. ${cogs.toLocaleString()}</span></div>
      <div class="row-total"><span>TOTAL COGS</span><span>Rs. ${cogs.toLocaleString()}</span></div>
    </div>
    <div class="section">
      <h3>💰 GROSS PROFIT</h3>
      <div class="row"><span>Revenue</span><span>Rs. ${revenue.toLocaleString()}</span></div>
      <div class="row"><span>Less: Cost of Goods Sold</span><span class="loss">- Rs. ${cogs.toLocaleString()}</span></div>
      <div class="row-total"><span>GROSS PROFIT</span><span style="color:${grossProfit >= 0 ? '#4ade80' : '#fca5a5'}">Rs. ${grossProfit.toLocaleString()} (${grossMargin}%)</span></div>
    </div>
    <div class="section">
      <h3>📊 BALANCE SHEET SNAPSHOT</h3>
      <div class="row"><span>Accounts Receivable (owed to you)</span><span class="profit">Rs. ${(stats.total_receivables || 0).toLocaleString()}</span></div>
      <div class="row"><span>Accounts Payable (you owe suppliers)</span><span class="loss">Rs. ${(stats.total_payables || 0).toLocaleString()}</span></div>
      <div class="row"><span>Net Position</span><span style="font-weight:700;color:${(stats.total_receivables - stats.total_payables) >= 0 ? '#065f46' : '#991b1b'}">Rs. ${((stats.total_receivables || 0) - (stats.total_payables || 0)).toLocaleString()}</span></div>
    </div>
    <div class="footer"><p><strong>ProBiz ERP</strong> &nbsp;|&nbsp; probiz-erp-poru.vercel.app &nbsp;|&nbsp; Superadmin Report &nbsp;|&nbsp; Confidential</p></div>
    </div><script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  };

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

      {tab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Date Filter */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: '#1e293b' }}>📅 Period:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 13, color: '#64748b' }}>From</label>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 13, color: '#64748b' }}>To</label>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }} />
            </div>
            <button onClick={printSummary} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', marginLeft: 'auto' }}>
              <Printer size={14} /> Print Summary
            </button>
          </div>

          {/* KPI Cards */}
          {(() => {
            const totalSales = salesList.reduce((s, i) => s + (i.total || 0), 0);
            const totalPurchases = purchasesList.reduce((s, i) => s + (i.total || 0), 0);
            const profit = totalSales - totalPurchases;
            return (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                  {[
                    { label: `Total Sales`, sub: `${salesList.length} invoices`, value: `Rs. ${totalSales.toLocaleString()}`, color: '#1e40af', bg: '#dbeafe' },
                    { label: `Total Purchases`, sub: `${purchasesList.length} orders`, value: `Rs. ${totalPurchases.toLocaleString()}`, color: '#d97706', bg: '#fef3c7' },
                    { label: profit >= 0 ? 'Gross Profit' : 'Net Loss', sub: totalSales > 0 ? `${((profit/totalSales)*100).toFixed(1)}% margin` : '', value: `Rs. ${profit.toLocaleString()}`, color: profit >= 0 ? '#065f46' : '#991b1b', bg: profit >= 0 ? '#d1fae5' : '#fee2e2' },
                  ].map(({ label, sub, value, color, bg }) => (
                    <div key={label} style={{ background: bg, borderRadius: 14, padding: '20px 22px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{sub}</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Sales Table */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(135deg,#1e40af,#3b82f6)', padding: '12px 20px' }}>
                    <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>📦 Sales — {salesList.length} Invoices &nbsp;|&nbsp; Total: Rs. {totalSales.toLocaleString()}</h3>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr style={{ background: '#f8fafc' }}>
                      {['#', 'Invoice No', 'Customer', 'Date', 'Payment', 'Status', 'Total'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Total' ? 'right' : 'left', fontWeight: 600, fontSize: 12, color: '#64748b' }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {summaryLoading ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>Loading...</td></tr>
                        : salesList.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>No sales in this period</td></tr>
                        : salesList.map((s, i) => (
                          <tr key={s.id} style={{ borderBottom: '1px solid #f8fafc', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '9px 14px', color: '#94a3b8' }}>{i + 1}</td>
                            <td style={{ padding: '9px 14px', color: '#1e40af', fontWeight: 700 }}>{s.invoice_no}</td>
                            <td style={{ padding: '9px 14px' }}>{s.customer || 'Walk-in'}</td>
                            <td style={{ padding: '9px 14px', color: '#64748b' }}>{pkt(s.created_at)}</td>
                            <td style={{ padding: '9px 14px' }}><span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 20, fontSize: 11 }}>{s.payment_method}</span></td>
                            <td style={{ padding: '9px 14px' }}><span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{s.status}</span></td>
                            <td style={{ padding: '9px 14px', fontWeight: 700, textAlign: 'right', color: '#10b981' }}>Rs. {s.total?.toLocaleString()}</td>
                          </tr>
                        ))}
                      <tr style={{ background: '#dbeafe', borderTop: '2px solid #1e40af' }}>
                        <td colSpan={6} style={{ padding: '10px 14px', fontWeight: 800, textAlign: 'right', color: '#1e40af' }}>TOTAL SALES</td>
                        <td style={{ padding: '10px 14px', fontWeight: 900, textAlign: 'right', color: '#1e40af', fontSize: 15 }}>Rs. {totalSales.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Purchases Table */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', padding: '12px 20px' }}>
                    <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>🛒 Purchases — {purchasesList.length} Orders &nbsp;|&nbsp; Total: Rs. {totalPurchases.toLocaleString()}</h3>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr style={{ background: '#f8fafc' }}>
                      {['#', 'PO Number', 'Supplier', 'Date', 'Payment', 'Status', 'Total'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Total' ? 'right' : 'left', fontWeight: 600, fontSize: 12, color: '#64748b' }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {summaryLoading ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>Loading...</td></tr>
                        : purchasesList.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>No purchases in this period</td></tr>
                        : purchasesList.map((p, i) => (
                          <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '9px 14px', color: '#94a3b8' }}>{i + 1}</td>
                            <td style={{ padding: '9px 14px', color: '#d97706', fontWeight: 700 }}>{p.po_number}</td>
                            <td style={{ padding: '9px 14px' }}>{p.supplier}</td>
                            <td style={{ padding: '9px 14px', color: '#64748b' }}>{pkt(p.created_at)}</td>
                            <td style={{ padding: '9px 14px' }}><span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 20, fontSize: 11 }}>{p.payment_method}</span></td>
                            <td style={{ padding: '9px 14px' }}><span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{p.status}</span></td>
                            <td style={{ padding: '9px 14px', fontWeight: 700, textAlign: 'right', color: '#ef4444' }}>Rs. {p.total?.toLocaleString()}</td>
                          </tr>
                        ))}
                      <tr style={{ background: '#fef3c7', borderTop: '2px solid #d97706' }}>
                        <td colSpan={6} style={{ padding: '10px 14px', fontWeight: 800, textAlign: 'right', color: '#d97706' }}>TOTAL PURCHASES</td>
                        <td style={{ padding: '10px 14px', fontWeight: 900, textAlign: 'right', color: '#d97706', fontSize: 15 }}>Rs. {totalPurchases.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Net Summary */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: 300, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', fontSize: 14 }}>
                      <span style={{ color: '#64748b' }}>Total Sales</span>
                      <span style={{ fontWeight: 700, color: '#10b981' }}>Rs. {totalSales.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', fontSize: 14, borderTop: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#64748b' }}>Total Purchases</span>
                      <span style={{ fontWeight: 700, color: '#ef4444' }}>Rs. {totalPurchases.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: profit >= 0 ? '#1e40af' : '#ef4444', fontSize: 18, fontWeight: 900, color: '#fff' }}>
                      <span>{profit >= 0 ? 'GROSS PROFIT' : 'NET LOSS'}</span>
                      <span>Rs. {profit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {tab === 'profit' && stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* P&L KPI Cards */}
          {(() => {
            const revenue = stats.month_sales || 0;
            const cogs = stats.month_purchases || 0;
            const grossProfit = revenue - cogs;
            const margin = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : 0;
            return (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  {[
                    { label: 'Total Revenue', value: `Rs. ${revenue.toLocaleString()}`, color: '#1e40af', bg: '#dbeafe', icon: '📈' },
                    { label: 'Cost of Goods', value: `Rs. ${cogs.toLocaleString()}`, color: '#d97706', bg: '#fef3c7', icon: '📦' },
                    { label: 'Gross Profit', value: `Rs. ${grossProfit.toLocaleString()}`, color: grossProfit >= 0 ? '#065f46' : '#991b1b', bg: grossProfit >= 0 ? '#d1fae5' : '#fee2e2', icon: grossProfit >= 0 ? '💰' : '📉' },
                    { label: 'Profit Margin', value: `${margin}%`, color: '#16a34a', bg: '#f0fdf4', icon: '📊' },
                  ].map(({ label, value, color, bg, icon }) => (
                    <div key={label} style={{ background: bg, borderRadius: 14, padding: '20px 22px', border: `2px solid ${color}20` }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Income Statement */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(135deg,#1e40af,#3b82f6)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>📋 Profit & Loss Statement — This Month</h3>
                    <button onClick={printPL} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: '#fff', color: '#1e40af', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                      <Printer size={14} /> Print P&L
                    </button>
                  </div>

                  {/* Income Section */}
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#10b981', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #d1fae5' }}>📈 Income</div>
                    {[
                      ['Sales Revenue (This Month)', revenue],
                      ["Today's Sales", stats.today_sales || 0],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
                        <span style={{ color: '#475569' }}>{label}</span>
                        <span style={{ fontWeight: 700, color: '#10b981' }}>Rs. {val.toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f0fdf4', borderRadius: 8, marginTop: 8, fontWeight: 800, fontSize: 15 }}>
                      <span>Total Income</span><span style={{ color: '#10b981' }}>Rs. {revenue.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* COGS Section */}
                  <div style={{ padding: '0 24px 20px' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#ef4444', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #fee2e2' }}>📦 Cost of Goods Sold</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
                      <span style={{ color: '#475569' }}>Purchases / Stock Cost (This Month)</span>
                      <span style={{ fontWeight: 700, color: '#ef4444' }}>Rs. {cogs.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#fef2f2', borderRadius: 8, marginTop: 8, fontWeight: 800, fontSize: 15 }}>
                      <span>Total COGS</span><span style={{ color: '#ef4444' }}>Rs. {cogs.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Gross Profit */}
                  <div style={{ margin: '0 24px 20px', background: grossProfit >= 0 ? '#1e40af' : '#ef4444', borderRadius: 12, padding: '16px 20px', color: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>GROSS PROFIT = Revenue − COGS</div>
                        <div style={{ fontSize: 28, fontWeight: 900 }}>Rs. {grossProfit.toLocaleString()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>PROFIT MARGIN</div>
                        <div style={{ fontSize: 32, fontWeight: 900 }}>{margin}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Balance Sheet Snapshot */}
                  <div style={{ padding: '0 24px 24px' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #ede9fe' }}>📊 Balance Snapshot</div>
                    {[
                      ['Accounts Receivable (customers owe you)', stats.total_receivables || 0, '#10b981'],
                      ['Accounts Payable (you owe suppliers)', stats.total_payables || 0, '#ef4444'],
                      ['Net Position', (stats.total_receivables || 0) - (stats.total_payables || 0), ((stats.total_receivables || 0) - (stats.total_payables || 0)) >= 0 ? '#10b981' : '#ef4444'],
                    ].map(([label, val, color]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
                        <span style={{ color: '#475569' }}>{label}</span>
                        <span style={{ fontWeight: 800, color, fontSize: 15 }}>Rs. {val.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly P&L Chart */}
                {monthlyData.length > 0 && (
                  <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Monthly Profit Trend</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={monthlyData.map(m => ({ ...m, profit: m.sales - m.purchases }))} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <Tooltip formatter={(v, name) => [`Rs. ${v.toLocaleString()}`, name]} />
                        <Legend />
                        <Bar dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]} name="Revenue" barSize={22} />
                        <Bar dataKey="purchases" fill="#f59e0b" radius={[4,4,0,0]} name="Cost" barSize={22} />
                        <Bar dataKey="profit" radius={[4,4,0,0]} name="Profit" barSize={22}>
                          {monthlyData.map((m, i) => <Cell key={i} fill={(m.sales - m.purchases) >= 0 ? '#10b981' : '#ef4444'} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

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
