import React, { useEffect, useState } from 'react';
import API from '../api/client';
import toast from 'react-hot-toast';
import { Plus, BookOpen, X, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 460 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 18 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 5 }}>{label}</label>
    <input {...props} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif' }} />
  </div>
);

const ACCOUNT_TYPES = ['asset', 'liability', 'equity', 'income', 'expense'];
const TYPE_COLORS = { asset: '#3b82f6', liability: '#ef4444', equity: '#8b5cf6', income: '#10b981', expense: '#f59e0b' };

export default function Accounting() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [tab, setTab] = useState('summary');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTxnModal, setShowTxnModal] = useState(false);
  const [accountForm, setAccountForm] = useState({ name: '', account_type: 'asset', account_code: '', description: '' });
  const [txnForm, setTxnForm] = useState({ account_id: '', description: '', debit: '', credit: '', reference: '' });

  const load = async () => {
    const [aRes, tRes, sRes] = await Promise.all([
      API.get('/api/accounting/accounts'),
      API.get('/api/accounting/transactions'),
      API.get('/api/accounting/summary'),
    ]);
    setAccounts(aRes.data);
    setTransactions(tRes.data.transactions);
    setSummary(sRes.data);
  };

  useEffect(() => { load(); }, []);

  const saveAccount = async () => {
    if (!accountForm.name || !accountForm.account_code) { toast.error('Name and code required'); return; }
    try { await API.post('/api/accounting/accounts', accountForm); toast.success('Account created'); setShowAccountModal(false); load(); }
    catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
  };

  const saveTxn = async () => {
    if (!txnForm.account_id || !txnForm.description) { toast.error('Account and description required'); return; }
    try {
      await API.post('/api/accounting/transactions', { ...txnForm, account_id: parseInt(txnForm.account_id), debit: parseFloat(txnForm.debit) || 0, credit: parseFloat(txnForm.credit) || 0 });
      toast.success('Transaction recorded'); setShowTxnModal(false); load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
  };

  const grouped = ACCOUNT_TYPES.reduce((acc, type) => {
    acc[type] = accounts.filter(a => a.account_type === type);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 26, fontWeight: 800 }}>Accounting</h1><p style={{ color: '#64748b', marginTop: 2 }}>Chart of accounts, transactions and financial reports</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowAccountModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            <Plus size={16} /> New Account
          </button>
          <button onClick={() => setShowTxnModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            <Plus size={16} /> Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            ['Total Assets', summary.total_assets, '#3b82f6', '#dbeafe'],
            ['Total Liabilities', summary.total_liabilities, '#ef4444', '#fee2e2'],
            ['Total Income', summary.total_income, '#10b981', '#d1fae5'],
            ['Total Expenses', summary.total_expense, '#f59e0b', '#fef3c7'],
            ['Net Profit', summary.net_profit, summary.net_profit >= 0 ? '#10b981' : '#ef4444', summary.net_profit >= 0 ? '#d1fae5' : '#fee2e2'],
          ].map(([label, value, color, bg]) => (
            <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', border: `1px solid ${bg}` }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color }}>Rs. {value?.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 10, marginBottom: 24, width: 'fit-content' }}>
        {['summary', 'accounts', 'transactions'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#1e40af' : '#64748b', textTransform: 'capitalize', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>{t}</button>
        ))}
      </div>

      {tab === 'summary' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {ACCOUNT_TYPES.map(type => (
            grouped[type]?.length > 0 && (
              <div key={type} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', background: TYPE_COLORS[type] + '12', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, textTransform: 'capitalize', color: TYPE_COLORS[type] }}>{type} Accounts</span>
                  <span style={{ fontWeight: 700, color: TYPE_COLORS[type] }}>Rs. {grouped[type].reduce((s, a) => s + a.balance, 0).toLocaleString()}</span>
                </div>
                {grouped[type].map(a => (
                  <div key={a.id} style={{ padding: '11px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', fontSize: 14 }}>
                    <div>
                      <span style={{ fontWeight: 500 }}>{a.name}</span>
                      <span style={{ color: '#94a3b8', fontSize: 12, marginLeft: 8 }}>({a.account_code})</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>Rs. {a.balance?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )
          ))}
        </div>
      )}

      {tab === 'accounts' && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Code', 'Account Name', 'Type', 'Balance'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#64748b' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {accounts.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '11px 16px', fontFamily: 'monospace', color: '#64748b' }}>{a.account_code}</td>
                  <td style={{ padding: '11px 16px', fontWeight: 600 }}>{a.name}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ background: TYPE_COLORS[a.account_type] + '18', color: TYPE_COLORS[a.account_type], padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{a.account_type}</span>
                  </td>
                  <td style={{ padding: '11px 16px', fontWeight: 700 }}>Rs. {a.balance?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'transactions' && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Date', 'Account', 'Description', 'Reference', 'Debit', 'Credit'].map(h => <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#64748b' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {transactions.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No transactions yet</td></tr>
                : transactions.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 12 }}>{t.date ? new Date(t.date).toLocaleDateString('en-PK') : '-'}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{t.account}</td>
                    <td style={{ padding: '10px 14px', color: '#475569' }}>{t.description}</td>
                    <td style={{ padding: '10px 14px', color: '#64748b', fontFamily: 'monospace', fontSize: 12 }}>{t.reference || '-'}</td>
                    <td style={{ padding: '10px 14px', color: '#10b981', fontWeight: 600 }}>{t.debit > 0 ? `Rs. ${t.debit.toLocaleString()}` : '-'}</td>
                    <td style={{ padding: '10px 14px', color: '#ef4444', fontWeight: 600 }}>{t.credit > 0 ? `Rs. ${t.credit.toLocaleString()}` : '-'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {showAccountModal && (
        <Modal title="Create Account" onClose={() => setShowAccountModal(false)}>
          <Input label="Account Name *" value={accountForm.name} onChange={e => setAccountForm({ ...accountForm, name: e.target.value })} />
          <Input label="Account Code *" value={accountForm.account_code} onChange={e => setAccountForm({ ...accountForm, account_code: e.target.value })} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 5 }}>Account Type</label>
            <select value={accountForm.account_type} onChange={e => setAccountForm({ ...accountForm, account_type: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#fff' }}>
              {ACCOUNT_TYPES.map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setShowAccountModal(false)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            <button onClick={saveAccount} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Create</button>
          </div>
        </Modal>
      )}

      {showTxnModal && (
        <Modal title="Record Transaction" onClose={() => setShowTxnModal(false)}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 5 }}>Account *</label>
            <select value={txnForm.account_id} onChange={e => setTxnForm({ ...txnForm, account_id: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#fff' }}>
              <option value="">Select Account</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.account_code} — {a.name}</option>)}
            </select>
          </div>
          <Input label="Description *" value={txnForm.description} onChange={e => setTxnForm({ ...txnForm, description: e.target.value })} />
          <Input label="Reference" value={txnForm.reference} onChange={e => setTxnForm({ ...txnForm, reference: e.target.value })} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Debit (Rs.)" type="number" value={txnForm.debit} onChange={e => setTxnForm({ ...txnForm, debit: e.target.value })} />
            <Input label="Credit (Rs.)" type="number" value={txnForm.credit} onChange={e => setTxnForm({ ...txnForm, credit: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setShowTxnModal(false)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            <button onClick={saveTxn} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Record</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
