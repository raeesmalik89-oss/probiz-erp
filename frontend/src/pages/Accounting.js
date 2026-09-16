import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { formatDate } from '../utils/dateFormat';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import { PageSpinner } from '../components/ui/Spinner';
import { exportCSV } from '../utils/csvExport';
import { Plus, BookOpen, DollarSign, TrendingUp, TrendingDown, Download, BarChart3 } from 'lucide-react';

const ACCOUNT_TYPES = ['asset', 'liability', 'equity', 'income', 'expense'];
const TYPE_COLORS = {
  asset:     { text: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100',   badge: 'badge-blue' },
  liability: { text: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-100',    badge: 'badge-red' },
  equity:    { text: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', badge: 'badge-blue' },
  income:    { text: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-100',badge: 'badge-green' },
  expense:   { text: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100',  badge: 'badge-yellow' },
};

function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${active === t ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

export default function Accounting() {
  const [accounts, setAccounts]         = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary]           = useState(null);
  const [tab, setTab]                   = useState('summary');
  const [loading, setLoading]           = useState(true);
  const [accountModal, setAccountModal] = useState(false);
  const [txnModal, setTxnModal]         = useState(false);
  const [saving, setSaving]             = useState(false);
  const [accountForm, setAccountForm]   = useState({ name: '', account_type: 'asset', account_code: '', description: '' });
  const [txnForm, setTxnForm]           = useState({ account_id: '', description: '', debit: '', credit: '', reference: '' });
  const setA = (k, v) => setAccountForm(f => ({ ...f, [k]: v }));
  const setT = (k, v) => setTxnForm(f => ({ ...f, [k]: v }));

  const load = async () => {
    setLoading(true);
    try {
      const [aRes, tRes, sRes] = await Promise.all([
        API.get('/api/accounting/accounts'),
        API.get('/api/accounting/transactions'),
        API.get('/api/accounting/summary'),
      ]);
      setAccounts(aRes.data);
      setTransactions(tRes.data.transactions);
      setSummary(sRes.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const saveAccount = async () => {
    if (!accountForm.name || !accountForm.account_code) { toast.error('Name and code required'); return; }
    setSaving(true);
    try { await API.post('/api/accounting/accounts', accountForm); toast.success('Account created'); setAccountModal(false); load(); }
    catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
    finally { setSaving(false); }
  };

  const saveTxn = async () => {
    if (!txnForm.account_id || !txnForm.description) { toast.error('Account and description required'); return; }
    setSaving(true);
    try {
      await API.post('/api/accounting/transactions', { ...txnForm, account_id: parseInt(txnForm.account_id), debit: parseFloat(txnForm.debit) || 0, credit: parseFloat(txnForm.credit) || 0 });
      toast.success('Transaction recorded'); setTxnModal(false); load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
    finally { setSaving(false); }
  };

  const grouped = ACCOUNT_TYPES.reduce((acc, type) => {
    acc[type] = accounts.filter(a => a.account_type === type);
    return acc;
  }, {});

  if (loading) return <PageSpinner text="Loading accounting data..." />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Accounting</h1>
          <p className="page-subtitle">Chart of accounts, journal entries and financial summary</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => exportCSV(transactions.map(t => ({ Date: t.date, Account: t.account, Description: t.description, Reference: t.reference, Debit: t.debit, Credit: t.credit })), 'transactions.csv')} className="btn-secondary text-xs">
            <Download size={13} /> Export
          </button>
          <button onClick={() => setAccountModal(true)} className="btn-secondary text-xs">
            <Plus size={13} /> New Account
          </button>
          <button onClick={() => setTxnModal(true)} className="btn-primary text-xs">
            <Plus size={13} /> Add Transaction
          </button>
        </div>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Total Assets',      value: summary.total_assets,      icon: BarChart3,   cls: TYPE_COLORS.asset },
            { label: 'Total Liabilities', value: summary.total_liabilities, icon: TrendingDown, cls: TYPE_COLORS.liability },
            { label: 'Total Income',      value: summary.total_income,      icon: TrendingUp,  cls: TYPE_COLORS.income },
            { label: 'Total Expenses',    value: summary.total_expense,     icon: DollarSign,  cls: TYPE_COLORS.expense },
            { label: 'Net Profit',        value: summary.net_profit,        icon: TrendingUp,
              cls: summary.net_profit >= 0 ? TYPE_COLORS.income : TYPE_COLORS.liability },
          ].map(c => (
            <div key={c.label} className={`card p-4 border ${c.cls.border}`}>
              <div className={`w-8 h-8 rounded-lg ${c.cls.bg} flex items-center justify-center mb-2`}>
                <c.icon size={16} className={c.cls.text} />
              </div>
              <p className={`text-lg font-extrabold ${c.cls.text}`}>Rs. {c.value?.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      <TabBar tabs={['summary', 'accounts', 'transactions']} active={tab} onChange={setTab} />

      {/* Summary tab */}
      {tab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {ACCOUNT_TYPES.map(type => grouped[type]?.length > 0 && (
            <div key={type} className={`card overflow-hidden border ${TYPE_COLORS[type].border}`}>
              <div className={`flex items-center justify-between px-5 py-3 ${TYPE_COLORS[type].bg} border-b ${TYPE_COLORS[type].border}`}>
                <span className={`font-bold capitalize ${TYPE_COLORS[type].text}`}>{type} Accounts</span>
                <span className={`font-bold ${TYPE_COLORS[type].text}`}>
                  Rs. {grouped[type].reduce((s, a) => s + a.balance, 0).toLocaleString()}
                </span>
              </div>
              {grouped[type].map(a => (
                <div key={a.id} className="flex items-center justify-between px-5 py-2.5 border-b border-gray-50 last:border-0 text-sm">
                  <div>
                    <span className="font-medium text-gray-800">{a.name}</span>
                    <span className="text-gray-400 text-xs ml-2">({a.account_code})</span>
                  </div>
                  <span className="font-semibold text-gray-700">Rs. {a.balance?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Accounts tab */}
      {tab === 'accounts' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>{['Code', 'Account Name', 'Type', 'Balance'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
              </thead>
              <tbody>
                {accounts.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-gray-400">No accounts yet</td></tr>
                ) : accounts.map(a => (
                  <tr key={a.id} className="table-row">
                    <td className="table-cell font-mono text-gray-500 text-xs">{a.account_code}</td>
                    <td className="table-cell font-semibold">{a.name}</td>
                    <td className="table-cell">
                      <span className={`${TYPE_COLORS[a.account_type]?.badge || 'badge-gray'} capitalize`}>{a.account_type}</span>
                    </td>
                    <td className="table-cell font-bold">Rs. {a.balance?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions tab */}
      {tab === 'transactions' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>{['Date', 'Account', 'Description', 'Reference', 'Debit', 'Credit'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">No transactions yet</td></tr>
                ) : transactions.map(t => (
                  <tr key={t.id} className="table-row">
                    <td className="table-cell text-xs text-gray-500">{t.date ? formatDate(t.date) : '—'}</td>
                    <td className="table-cell font-semibold">{t.account}</td>
                    <td className="table-cell text-gray-600">{t.description}</td>
                    <td className="table-cell font-mono text-xs text-gray-400">{t.reference || '—'}</td>
                    <td className="table-cell font-semibold text-emerald-600">{t.debit > 0 ? `Rs. ${t.debit.toLocaleString()}` : '—'}</td>
                    <td className="table-cell font-semibold text-red-500">{t.credit > 0 ? `Rs. ${t.credit.toLocaleString()}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Account Modal */}
      {accountModal && (
        <Modal title="Create Account" onClose={() => setAccountModal(false)} size="sm"
          footer={<div className="flex gap-2 justify-end"><button onClick={() => setAccountModal(false)} className="btn-secondary text-xs">Cancel</button><button onClick={saveAccount} disabled={saving} className="btn-primary text-xs">{saving ? 'Saving...' : 'Create'}</button></div>}>
          <div className="space-y-3">
            <div><label className="label">Account Name *</label><input className="input text-sm" value={accountForm.name} onChange={e => setA('name', e.target.value)} /></div>
            <div><label className="label">Account Code *</label><input className="input text-sm" value={accountForm.account_code} onChange={e => setA('account_code', e.target.value)} /></div>
            <div>
              <label className="label">Account Type</label>
              <select className="input text-sm" value={accountForm.account_type} onChange={e => setA('account_type', e.target.value)}>
                {ACCOUNT_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* New Transaction Modal */}
      {txnModal && (
        <Modal title="Record Transaction" onClose={() => setTxnModal(false)} size="sm"
          footer={<div className="flex gap-2 justify-end"><button onClick={() => setTxnModal(false)} className="btn-secondary text-xs">Cancel</button><button onClick={saveTxn} disabled={saving} className="btn-primary text-xs">{saving ? 'Saving...' : 'Record'}</button></div>}>
          <div className="space-y-3">
            <div>
              <label className="label">Account *</label>
              <select className="input text-sm" value={txnForm.account_id} onChange={e => setT('account_id', e.target.value)}>
                <option value="">Select Account</option>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.account_code} — {a.name}</option>)}
              </select>
            </div>
            <div><label className="label">Description *</label><input className="input text-sm" value={txnForm.description} onChange={e => setT('description', e.target.value)} /></div>
            <div><label className="label">Reference</label><input className="input text-sm" value={txnForm.reference} onChange={e => setT('reference', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Debit (Rs.)</label><input type="number" className="input text-sm" value={txnForm.debit} onChange={e => setT('debit', e.target.value)} /></div>
              <div><label className="label">Credit (Rs.)</label><input type="number" className="input text-sm" value={txnForm.credit} onChange={e => setT('credit', e.target.value)} /></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
