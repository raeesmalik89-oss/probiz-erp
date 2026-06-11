import React, { useEffect, useState, createContext, useContext } from 'react';
import API from '../api/client';

const SubContext = createContext({});
export const useSubscription = () => useContext(SubContext);

// ── Trial Banner ─────────────────────────────────────────────────────────────
const TrialBanner = ({ sub, onUpgrade }) => {
  if (!sub || sub.plan !== 'trial' || !sub.is_active) return null;
  const days = sub.days_remaining;
  const urgent = days <= 3;
  const bg = urgent ? '#dc2626' : days <= 7 ? '#d97706' : '#1e40af';

  return (
    <div style={{ background: bg, color: '#fff', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, fontWeight: 600, zIndex: 999 }}>
      <span>
        {urgent ? '🚨' : '⏳'} Free Trial — <strong>{days} day{days !== 1 ? 's' : ''}</strong> remaining
        {urgent ? ' — Upgrade NOW to avoid losing access!' : ' — Upgrade to keep all features'}
      </span>
      <button onClick={onUpgrade} style={{ background: '#fff', color: bg, border: 'none', borderRadius: 6, padding: '5px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
        Upgrade Now
      </button>
    </div>
  );
};

// ── Paywall Screen ────────────────────────────────────────────────────────────
const PaywallScreen = ({ sub, onContact }) => {
  const plans = sub?.plans || {};

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      {/* Lock Icon */}
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
      <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Trial Expired</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 32, textAlign: 'center', maxWidth: 400 }}>
        Your 14-day free trial has ended. Choose a plan to continue using <strong style={{ color: '#3b82f6' }}>ProBiz ERP</strong>.
      </p>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32, maxWidth: 800, width: '100%' }}>
        {[
          { key: 'basic', name: 'Basic', price: 'Rs. 2,500', period: '/month', color: '#3b82f6', features: ['1 Branch', '3 Users', 'POS + Invoices', 'Reports', 'Inventory'] },
          { key: 'professional', name: 'Professional', price: 'Rs. 5,000', period: '/month', color: '#8b5cf6', badge: '⭐ Popular', features: ['3 Branches', '10 Users', 'All Basic features', 'Profit & Loss', 'HR & Payroll'] },
          { key: 'enterprise', name: 'Enterprise', price: 'Rs. 15,000', period: '/month', color: '#10b981', features: ['Unlimited Branches', 'Unlimited Users', 'All features', 'Priority Support', 'Custom Branding'] },
        ].map(plan => (
          <div key={plan.key} style={{ background: 'rgba(255,255,255,0.05)', border: `2px solid ${plan.color}`, borderRadius: 16, padding: 24, textAlign: 'center', position: 'relative' }}>
            {plan.badge && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#fff', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{plan.badge}</div>}
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{plan.name}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: plan.color }}>{plan.price}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 16 }}>{plan.period}</div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 20, textAlign: 'left' }}>
              {plan.features.map(f => <li key={f} style={{ color: '#cbd5e1', fontSize: 12, padding: '3px 0' }}>✓ {f}</li>)}
            </ul>
            <button onClick={onContact} style={{ width: '100%', padding: '10px', background: plan.color, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
              Get This Plan
            </button>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', borderRadius: 12, padding: '16px 28px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>📞 Contact us to activate your plan:</p>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>0316-8818693 &nbsp;|&nbsp; raees.malik89@gmail.com</p>
        <p style={{ color: '#64748b', fontSize: 11, marginTop: 6 }}>We'll activate your account within minutes after payment confirmation</p>
      </div>
    </div>
  );
};

// ── Upgrade Modal ─────────────────────────────────────────────────────────────
const UpgradeModal = ({ onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 20, padding: 36, maxWidth: 420, width: '100%', textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Upgrade ProBiz ERP</h2>
      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>Contact us to upgrade your plan and keep all your data safe.</p>
      <div style={{ background: '#0f172a', borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <p style={{ color: '#3b82f6', fontWeight: 700, fontSize: 18 }}>📞 0316-8818693</p>
        <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 6 }}>raees.malik89@gmail.com</p>
        <p style={{ color: '#64748b', fontSize: 12, marginTop: 8 }}>Basic: Rs. 2,500/mo &nbsp;|&nbsp; Pro: Rs. 5,000/mo</p>
      </div>
      <button onClick={onClose} style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
        Close
      </button>
    </div>
  </div>
);

// ── Main Guard ────────────────────────────────────────────────────────────────
export default function SubscriptionGuard({ children }) {
  const [sub, setSub] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    API.get('/api/subscription/status')
      .then(r => setSub(r.data))
      .catch(() => setSub(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <>{children}</>;

  const isExpired = sub && !sub.is_active;

  return (
    <SubContext.Provider value={{ sub, refresh: () => API.get('/api/subscription/status').then(r => setSub(r.data)) }}>
      {isExpired && <PaywallScreen sub={sub} onContact={() => setShowUpgrade(true)} />}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      {sub && sub.plan === 'trial' && sub.is_active && (
        <TrialBanner sub={sub} onUpgrade={() => setShowUpgrade(true)} />
      )}
      {children}
    </SubContext.Provider>
  );
}
