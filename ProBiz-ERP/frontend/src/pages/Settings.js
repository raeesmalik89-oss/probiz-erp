import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, User, Building2, Shield, Bell, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

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
  const [companyName, setCompanyName] = useState('ProBiz Enterprise');
  const [companyAddress, setCompanyAddress] = useState('Main Gulberg, Lahore, Pakistan');
  const [companyPhone, setCompanyPhone] = useState('042-37426911');
  const [companyEmail, setCompanyEmail] = useState('info@probiz-erp.pk');
  const [currency, setCurrency] = useState('PKR (Rs.)');
  const [taxRate, setTaxRate] = useState('0');
  const [notifications, setNotifications] = useState({ lowStock: true, salesAlert: false, payroll: true });

  const save = () => toast.success('Settings saved successfully!');

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Settings</h1>
        <p style={{ color: '#64748b', marginTop: 2 }}>System configuration and preferences</p>
      </div>

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

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={save} style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Save All Settings</button>
      </div>
    </div>
  );
}
