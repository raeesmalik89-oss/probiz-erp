import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { TrendingUp, Eye, EyeOff, Lock, Mail, CheckCircle, ArrowRight } from 'lucide-react';

const highlights = [
  ['70+ Modules', 'Everything from POS to Payroll'],
  ['Multi-Branch', 'Manage unlimited locations'],
  ['Real-time Reports', 'Data-driven decisions'],
];

const demoAccounts = [
  { label: 'Admin', email: 'admin@probiz.pk' },
  { label: 'Manager', email: 'manager@probiz.pk' },
  { label: 'Cashier', email: 'cashier@probiz.pk' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-[6%] py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-violet-500/10 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <span className="text-white font-extrabold text-2xl">ProBiz ERP</span>
          </div>
          <h2 className="text-white text-4xl font-extrabold leading-tight mb-4">
            Your Complete<br />Business Platform
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-12 max-w-md">
            Inventory · Sales · Accounting · Payroll · Analytics — all in one powerful system.
          </p>
          {highlights.map(([title, desc]) => (
            <div key={title} className="flex gap-3.5 mb-5">
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle size={15} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-[15px]">{title}</div>
                <div className="text-white/55 text-[13px]">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 dark:text-white">ProBiz ERP</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Sign In</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Access your business dashboard</p>

          {/* Demo accounts (prefill email only — no stored passwords) */}
          <div className="bg-slate-100 dark:bg-slate-800/60 rounded-xl p-4 mb-7">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2.5">
              Demo accounts — fills email, enter the password
            </div>
            <div className="flex gap-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword(''); }}
                  className="flex-1 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[13px] font-semibold text-blue-700 dark:text-blue-300 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  autoComplete="username"
                  className="input !py-3 !pl-11"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  autoComplete="current-password"
                  className="input !py-3 !pl-11 !pr-11"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Signing in…' : <>Sign In to Dashboard <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="/" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline">← Back to website</a>
          </p>
        </div>
      </div>
    </div>
  );
}
