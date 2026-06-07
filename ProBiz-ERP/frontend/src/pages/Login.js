import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { TrendingUp, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('raees.malik89@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/app/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: 'Admin', email: 'raees.malik89@gmail.com', password: 'admin123' },
    { label: 'Manager', email: 'manager@probiz.pk', password: 'manager123' },
    { label: 'Cashier', email: 'cashier@probiz.pk', password: 'cashier123' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      {/* Left panel */}
      <div style={{
        flex: 1, background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#2563eb 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 5%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} color="#fff" />
          </div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 26 }}>ProBiz ERP</span>
        </div>
        <h2 style={{ color: '#fff', fontSize: 36, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
          Your Complete<br />Business Platform
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.7, marginBottom: 48 }}>
          Inventory · Sales · Accounting · Payroll · Analytics — all in one powerful system.
        </p>
        {[['70+ Modules', 'Everything from POS to Payroll'],
          ['Multi-Branch', 'Manage unlimited locations'],
          ['Real-time Reports', 'Data-driven decisions']
        ].map(([title, desc]) => (
          <div key={title} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <span style={{ color: '#34d399', fontSize: 14 }}>✓</span>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{title}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Sign In</h1>
          <p style={{ color: '#64748b', marginBottom: 36 }}>Access your business dashboard</p>

          {/* Demo accounts */}
          <div style={{ background: '#f1f5f9', borderRadius: 12, padding: 16, marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Demo Accounts</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {demoAccounts.map(acc => (
                <button key={acc.label} onClick={() => { setEmail(acc.email); setPassword(acc.password); }} style={{
                  flex: 1, padding: '7px 0', background: '#fff', border: '1px solid #e2e8f0',
                  borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  color: '#1e40af', transition: 'all 0.2s',
                }}>{acc.label}</button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Email Address</label>
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width: '100%', padding: '13px 14px 13px 44px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Password</label>
            <div style={{ position: 'relative', marginBottom: 28 }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                style={{ width: '100%', padding: '13px 44px 13px 44px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', fontFamily: 'Inter, sans-serif' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </button>
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg,#1e40af,#3b82f6)',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700,
              fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'Signing in...' : 'Sign In to Dashboard →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 24, color: '#64748b', fontSize: 14 }}>
            <a href="/" style={{ color: '#1e40af', fontWeight: 600, textDecoration: 'none' }}>← Back to website</a>
          </p>
        </div>
      </div>
    </div>
  );
}
