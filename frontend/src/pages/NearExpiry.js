import React, { useEffect, useState } from 'react';
import API from '../api/client';
import toast from 'react-hot-toast';
import { CalendarClock, Download, AlertTriangle } from 'lucide-react';
import { exportCSV } from '../utils/csvExport';
import { locationLabel, ExpiryBadge } from './Inventory';

const WINDOWS = [30, 60, 90, 180];

export default function NearExpiry() {
  const [days, setDays] = useState(90);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/inventory/near-expiry', { params: { days } });
      setItems(res.data.products);
    } catch {
      toast.error('Could not load near-expiry list');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [days]);

  const expiredCount = items.filter(i => i.expiry_status === 'expired').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <CalendarClock size={26} color="#0f766e" /> Near Expiry
          </h1>
          <p style={{ color: 'var(--ink-muted)', marginTop: 2 }}>Stock expiring soon — pull it off the shelf before it's a loss.</p>
        </div>
        <button onClick={() => exportCSV(items.map(i => ({ Name: i.name, 'Generic/Salt': i.generic_name, Batch: i.batch_no, Location: locationLabel(i), Stock: `${i.stock} ${i.unit}`, 'Expiry Date': i.expiry_date, 'Days Left': i.days_to_expiry })), 'near-expiry.csv')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'var(--panel-3)', color: 'var(--ink-label)', border: '1px solid var(--line)', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          <Download size={16} /> Export Pull-List
        </button>
      </div>

      {/* Window selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)' }}>Expiring within:</span>
        {WINDOWS.map(w => (
          <button key={w} onClick={() => setDays(w)}
            style={{ padding: '7px 16px', borderRadius: 20, border: `1px solid ${days === w ? '#0f766e' : 'var(--line)'}`, background: days === w ? '#0f766e' : 'var(--panel)', color: days === w ? '#fff' : 'var(--ink-label)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            {w} days
          </button>
        ))}
      </div>

      {expiredCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#b91c1c', padding: '10px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600, fontSize: 14 }}>
          <AlertTriangle size={18} /> {expiredCount} item{expiredCount > 1 ? 's are' : ' is'} already expired — remove from sale.
        </div>
      )}

      <div style={{ background: 'var(--panel)', borderRadius: 16, border: '1px solid var(--line)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--panel-2)', borderBottom: '1px solid var(--line)' }}>
              {['Product', 'Batch', 'Location', 'Stock', 'Expiry Date', 'Status'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--ink-faint)' }}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--ink-faint)' }}>
                <CalendarClock size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                Nothing expiring within {days} days. 🎉
              </td></tr>
            ) : items.map(i => (
              <tr key={i.id} style={{ borderBottom: '1px solid var(--line-2)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                  {i.name}
                  {i.generic_name && <div style={{ fontWeight: 400, fontSize: 12, color: 'var(--ink-faint)', marginTop: 2 }}>{i.generic_name}</div>}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-muted)', fontFamily: 'monospace', fontSize: 12 }}>{i.batch_no || '-'}</td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-muted)', fontSize: 13 }}>{locationLabel(i) || '—'}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>{i.stock} {i.unit}</td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-muted)' }}>{i.expiry_date}</td>
                <td style={{ padding: '12px 16px' }}><ExpiryBadge status={i.expiry_status} days={i.days_to_expiry} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
