import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, User, Building2, Shield, Bell, AlertTriangle, RefreshCw, CheckCircle, Crown, Calendar, Users, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/client';

const Section = ({ title, icon: Icon, children }) => (
  <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0', marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ width: 36, height: 36, background: '#dbeafe', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color="#1e40af" />
      </div>
      <h3 style={{ fontWeight: 700, fontSize: 16 }}>{title}</h3>
    </div>
    {children}
  </div>
);

const Field = ({ label, value, onChange, type = 'text', readOnly }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#374151' }}>{label}</label>
    <input type={type} value={value} onChange={onChange} readOnly={readOnly}
      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', background: readOnly ? '#f8fafc' : '#fff', color: readOnly ? '#94a3b8' : '#1e293b', fontFamily: 'Inter, sans-serif' }} />
  </div>
);

export default function Settings() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('Dr Muhammad Raees RPh');
  const [companyAddress, setCompanyAddress] = useState('House 124, Street 39, I-14/3, Islamabad');
  const [companyPhone, setCompanyPhone] = useState('0316-8818693');
  const [companyEmail, setCompanyEmail] = useState('raees.malik89@gmail.com');
  const [currency, setCurrency] = useState('PKR (Rs.)');
  const [taxRate, setTaxRate] = useState('0');
  const [notifications, setNotifications] = useState({ lowStock: true, salesAlert: false, payroll: true });
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Change password
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const handleChangePassword = async () => {
    if (pwForm.new_password !== pwForm.confirm) { toast.error('New passwords do not match'); return; }
    if (pwForm.new_password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setPwLoading(true);
    try {
      await API.post('/api/auth/change-password', { current_password: pwForm.current_password, new_password: pwForm.new_password });
      toast.success('Password changed successfully!');
      setPwForm({ current_password: '', new_password: '', confirm: '' });
    } catch (e) { toast.error(e.response?.data?.detail || 'Failed to change password'); }
    finally { setPwLoading(false); }
  };

  // Demo requests (superadmin only)
  const [demoRequests, setDemoRequests] = useState([]);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);
  const loadDemoRequests = async () => {
    if (demoLoaded) return;
    setDemoLoading(true);
    try { const r = await API.get('/api/demo/requests'); setDemoRequests(r.data); setDemoLoaded(true); }
    catch (e) { toast.error('Could not load demo requests'); }
    finally { setDemoLoading(false); }
  };
  const updateDemoStatus = async (id, status) => {
    await API.patch(`/api/demo/requests/${id}`, { status });
    setDemoRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success('Status updated');
  };
  const activateDemoTrial = async (id) => {
    await API.post(`/api/subscription/extend-trial?days=14`);
    await updateDemoStatus(id, 'activated');
    const updated = await API.get('/api/subscription/status');
    setSubStatus(updated.data);
    toast.success('14-day trial activated!');
  };

  // Subscription management (superadmin only)
  const [subStatus, setSubStatus] = useState(null);
  const [activating, setActivating] = useState(false);
  const [extendDays, setExtendDays] = useState(7);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [selectedMonths, setSelectedMonths] = useState(1);

  useEffect(() => {
    if (user?.role === 'superadmin') {
      API.get('/api/subscription/status').then(r => setSubStatus(r.data)).catch(() => {});
    }
  }, [user]);

  const handleActivatePlan = async () => {
    setActivating(true);
    try {
      const r = await API.post('/api/subscription/activate', { plan: selectedPlan, months: selectedMonths });
      toast.success(r.data.message);
      const updated = await API.get('/api/subscription/status');
      setSubStatus(updated.data);
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Activation failed');
    } finally { setActivating(false); }
  };

  const handleExtendTrial = async () => {
    setActivating(true);
    try {
      const r = await API.post(`/api/subscription/extend-trial?days=${extendDays}`);
      toast.success(r.data.message);
      const updated = await API.get('/api/subscription/status');
      setSubStatus(updated.data);
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Extend failed');
    } finally { setActivating(false); }
  };

  const save = () => toast.success('Settings saved successfully!');

  const handleReset = async () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    setResetting(true);
    try {
      await API.post('/api/admin/reset-demo');
      toast.success('System reset! Loaded clean demo data.');
      setConfirmReset(false);
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      toast.error('Reset failed: ' + (e.response?.data?.detail || 'Unknown error'));
    } finally {
      setResetting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Settings</h1>
        <p style={{ color: '#64748b', marginTop: 2 }}>System configuration and preferences</p>
      </div>

      {/* ── Subscription Management (superadmin only) ── */}
      {user?.role === 'superadmin' && (
        <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', borderRadius: 16, padding: 28, marginBottom: 20, border: '1px solid #1e40af' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Crown size={22} color="#fbbf24" />
            <h3 style={{ fontWeight: 800, fontSize: 17, color: '#fff', margin: 0 }}>Subscription Management</h3>
            <span style={{ marginLeft: 'auto', background: subStatus?.plan === 'trial' ? '#d97706' : '#10b981', color: '#fff', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
              {subStatus?.plan_name || 'Loading...'}
            </span>
          </div>

          {/* Current Status */}
          {subStatus && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { icon: <Crown size={16} />, label: 'Plan', value: subStatus.plan_name, color: '#fbbf24' },
                { icon: <Calendar size={16} />, label: subStatus.plan === 'trial' ? 'Trial Ends' : 'Paid Until', value: subStatus.trial_end || subStatus.paid_until || 'N/A', color: '#60a5fa' },
                { icon: <Zap size={16} />, label: 'Days Left', value: subStatus.days_remaining, color: subStatus.days_remaining <= 3 ? '#ef4444' : '#34d399' },
                { icon: <Users size={16} />, label: 'Max Users', value: subStatus.max_users, color: '#a78bfa' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
                  <div style={{ color: item.color, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{item.value}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Activate Paid Plan */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 16, marginTop: 0 }}>🚀 Activate Paid Plan</h4>
              <div style={{ marginBottom: 12 }}>
                <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Select Plan</label>
                <select value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }}>
                  <option value="basic">Basic — Rs. 2,500/mo (1 Branch, 3 Users)</option>
                  <option value="professional">Professional — Rs. 5,000/mo (3 Branches, 10 Users)</option>
                  <option value="enterprise">Enterprise — Rs. 15,000/mo (Unlimited)</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Duration (months)</label>
                <select value={selectedMonths} onChange={e => setSelectedMonths(Number(e.target.value))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }}>
                  {[1,2,3,6,12].map(m => <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}{m === 12 ? ' (1 Year)' : ''}</option>)}
                </select>
              </div>
              <button onClick={handleActivatePlan} disabled={activating} style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                {activating ? '⏳ Activating...' : '✅ Activate Plan'}
              </button>
            </div>

            {/* Extend Trial */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 16, marginTop: 0 }}>⏳ Extend Free Trial</h4>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
                Use this when a prospect needs more time to evaluate. Adds days to their current trial end date.
              </p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Extra Days</label>
                <select value={extendDays} onChange={e => setExtendDays(Number(e.target.value))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }}>
                  {[3,7,14,30].map(d => <option key={d} value={d}>+{d} days</option>)}
                </select>
              </div>
              <button onClick={handleExtendTrial} disabled={activating} style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                {activating ? '⏳ Extending...' : '➕ Extend Trial'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Demo Requests (superadmin only) ── */}
      {user?.role === 'superadmin' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: 36, height: 36, background: '#dcfce7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="#16a34a" />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>Demo Requests</h3>
            <span style={{ marginLeft: 8, background: '#fef3c7', color: '#d97706', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              {demoRequests.filter(r => r.status === 'new').length} new
            </span>
            <button onClick={loadDemoRequests} style={{ marginLeft: 'auto', padding: '7px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={14} /> {demoLoaded ? 'Refresh' : 'Load Requests'}
            </button>
          </div>

          {!demoLoaded ? (
            <p style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>Click "Load Requests" to see demo requests from the landing page.</p>
          ) : demoLoading ? (
            <p style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>Loading...</p>
          ) : demoRequests.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>No demo requests yet. Share your landing page to get leads!</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead><tr style={{ background: '#f8fafc' }}>
                  {['Name', 'Business', 'Phone', 'Industry', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {demoRequests.map(req => (
                    <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{req.name}</td>
                      <td style={{ padding: '10px 12px' }}>{req.business}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <a href={`https://wa.me/92${req.phone?.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
                          📱 {req.phone}
                        </a>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#64748b' }}>{req.industry || '—'}</td>
                      <td style={{ padding: '10px 12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{req.created_at?.slice(0,10)}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: req.status === 'new' ? '#fef3c7' : req.status === 'activated' ? '#dcfce7' : req.status === 'contacted' ? '#dbeafe' : '#f1f5f9',
                          color: req.status === 'new' ? '#d97706' : req.status === 'activated' ? '#16a34a' : req.status === 'contacted' ? '#1e40af' : '#64748b'
                        }}>{req.status}</span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {req.status === 'new' && (
                            <button onClick={() => updateDemoStatus(req.id, 'contacted')} style={{ padding: '5px 10px', background: '#dbeafe', color: '#1e40af', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                              📞 Contacted
                            </button>
                          )}
                          {req.status !== 'activated' && (
                            <button onClick={() => activateDemoTrial(req.id)} style={{ padding: '5px 10px', background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                              ✅ Activate Trial
                            </button>
                          )}
                          {req.status !== 'closed' && (
                            <button onClick={() => updateDemoStatus(req.id, 'closed')} style={{ padding: '5px 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                              ✕ Close
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Change Password ── */}
      <Section title="Change Password" icon={Shield}>
        <div style={{ maxWidth: 420 }}>
          {[
            ['Current Password', 'current_password'],
            ['New Password', 'new_password'],
            ['Confirm New Password', 'confirm'],
          ].map(([label, key]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#374151' }}>{label}</label>
              <input type="password" value={pwForm[key]} onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
            </div>
          ))}
          <button onClick={handleChangePassword} disabled={pwLoading} style={{ padding: '11px 28px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 4 }}>
            {pwLoading ? '⏳ Changing...' : '🔒 Change Password'}
          </button>
        </div>
      </Section>

      <Section title="Company Information" icon={Building2}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <Field label="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
          <Field label="Phone Number" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} />
          <div style={{ gridColumn: '1/-1' }}><Field label="Address" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} /></div>
          <Field label="Email" type="email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} />
          <Field label="Currency" value={currency} onChange={e => setCurrency(e.target.value)} />
        </div>
      </Section>

      <Section title="Logged-in User" icon={User}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <Field label="Full Name" value={user?.name} readOnly />
          <Field label="Email" value={user?.email} readOnly />
          <Field label="Role" value={user?.role} readOnly />
          <Field label="User ID" value={`#${user?.id}`} readOnly />
        </div>
      </Section>

      <Section title="Financial Settings" icon={SettingsIcon}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Default Tax Rate (%)</label>
            <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Fiscal Year Start</label>
            <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#fff' }}>
              <option>January</option><option>July</option><option>April</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Invoice Prefix</label>
            <input defaultValue="INV-" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>PO Prefix</label>
            <input defaultValue="PO-" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
          </div>
        </div>
      </Section>

      <Section title="Notifications" icon={Bell}>
        {[
          ['lowStock', 'Low stock alerts'],
          ['salesAlert', 'New sale notifications'],
          ['payroll', 'Payroll reminders'],
        ].map(([key, label]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 15, color: '#475569' }}>{label}</span>
            <button onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })} style={{
              width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
              background: notifications[key] ? '#1e40af' : '#e2e8f0', position: 'relative', transition: 'background 0.2s',
            }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: notifications[key] ? 25 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </button>
          </div>
        ))}
      </Section>

      <Section title="Role Permissions" icon={Shield}>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: '#f8fafc' }}>
              {['Permission', 'Superadmin', 'Admin', 'Manager', 'Cashier', 'Accountant'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {[
                ['View Dashboard', true, true, true, true, true],
                ['Manage Inventory', true, true, true, false, false],
                ['Process Sales', true, true, true, true, false],
                ['Manage Purchases', true, true, true, false, false],
                ['View Accounting', true, true, false, false, true],
                ['Manage Payroll', true, true, false, false, false],
                ['System Settings', true, false, false, false, false],
              ].map(([perm, ...vals]) => (
                <tr key={perm} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{perm}</td>
                  {vals.map((v, i) => (
                    <td key={i} style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: 16 }}>{v ? '✅' : '❌'}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Reset to Demo */}
      <Section title="Reset to Demo Data" icon={AlertTriangle}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
              This will <strong>delete all current data</strong> — all sales, inventory, customers, suppliers, employees and accounts — and replace with a small clean demo dataset (3 products, 2 customers, 1 sale) so you can see how the system works before entering your real data.
            </p>
            <p style={{ fontSize: 13, color: '#ef4444', marginTop: 10, marginBottom: 0 }}>
              ⚠️ Your admin login will be preserved. Everything else will be wiped.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            {confirmReset ? (
              <>
                <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 600, margin: 0, textAlign: 'right' }}>Are you sure? This cannot be undone.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setConfirmReset(false)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#475569' }}>
                    Cancel
                  </button>
                  <button onClick={handleReset} disabled={resetting} style={{ padding: '10px 22px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {resetting ? <><RefreshCw size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Resetting...</> : <><CheckCircle size={15} /> Yes, Reset Now</>}
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  </button>
                </div>
              </>
            ) : (
              <button onClick={handleReset} style={{ padding: '11px 24px', background: '#fff', border: '2px solid #ef4444', color: '#ef4444', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw size={15} /> Reset to Clean Demo
              </button>
            )}
          </div>
        </div>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={save} style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Save All Settings</button>
      </div>
    </div>
  );
}
