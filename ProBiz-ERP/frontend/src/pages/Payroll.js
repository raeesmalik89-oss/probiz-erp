import React, { useEffect, useState } from 'react';
import API from '../api/client';
import toast from 'react-hot-toast';
import { Plus, Search, UserCheck, Edit2, X, CheckCircle } from 'lucide-react';

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: wide ? 680 : 460, maxHeight: '90vh', overflowY: 'auto' }}>
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

export default function Payroll() {
  const [tab, setTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [search, setSearch] = useState('');
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [empForm, setEmpForm] = useState({ name: '', employee_id: '', email: '', phone: '', cnic: '', department_id: '', designation: '', basic_salary: '', allowances: '', deductions: '' });
  const [payslipForm, setPayslipForm] = useState({ employee_id: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(), overtime: 0, extra_deductions: 0 });

  const load = async () => {
    const [eRes, dRes, pRes] = await Promise.all([
      API.get('/api/payroll/employees', { params: search ? { search } : {} }),
      API.get('/api/payroll/departments'),
      API.get('/api/payroll/payslips'),
    ]);
    setEmployees(eRes.data);
    setDepartments(dRes.data);
    setPayslips(pRes.data);
  };

  useEffect(() => { load(); }, [search]);

  const openAddEmp = () => { setEditEmp(null); setEmpForm({ name: '', employee_id: `EMP-${String(employees.length + 1).padStart(3, '0')}`, email: '', phone: '', cnic: '', department_id: '', designation: '', basic_salary: '', allowances: 0, deductions: 0 }); setShowEmpModal(true); };
  const openEditEmp = (e) => { setEditEmp(e); setEmpForm({ name: e.name, employee_id: e.employee_id, email: '', phone: e.phone || '', cnic: '', department_id: e.department_id || '', designation: e.designation || '', basic_salary: e.basic_salary, allowances: e.allowances, deductions: '' }); setShowEmpModal(true); };

  const saveEmployee = async () => {
    if (!empForm.name || !empForm.employee_id) { toast.error('Name and Employee ID required'); return; }
    try {
      const data = { ...empForm, department_id: empForm.department_id || null, basic_salary: parseFloat(empForm.basic_salary) || 0, allowances: parseFloat(empForm.allowances) || 0, deductions: parseFloat(empForm.deductions) || 0 };
      if (editEmp) { await API.put(`/api/payroll/employees/${editEmp.id}`, data); toast.success('Employee updated'); }
      else { await API.post('/api/payroll/employees', data); toast.success('Employee added'); }
      setShowEmpModal(false); load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
  };

  const generatePayslip = async () => {
    if (!payslipForm.employee_id) { toast.error('Select employee'); return; }
    try {
      await API.post('/api/payroll/payslips/generate', { ...payslipForm, employee_id: parseInt(payslipForm.employee_id) });
      toast.success('Payslip generated'); setShowPayslipModal(false); load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
  };

  const markPaid = async (id) => {
    try { await API.put(`/api/payroll/payslips/${id}/pay`); toast.success('Marked as paid'); load(); }
    catch { toast.error('Error'); }
  };

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const totalPayroll = employees.reduce((s, e) => s + e.basic_salary + e.allowances, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 26, fontWeight: 800 }}>HR & Payroll</h1><p style={{ color: '#64748b', marginTop: 2 }}>Employees, attendance and salary management</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowPayslipModal(true)} style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Generate Payslip</button>
          <button onClick={openAddEmp} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}><Plus size={18} /> Add Employee</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[['Total Staff', employees.length, '#3b82f6'], ['Monthly Payroll', `Rs. ${totalPayroll.toLocaleString()}`, '#8b5cf6'], ['Departments', departments.length, '#10b981'], ['Payslips This Month', payslips.filter(p => p.month === new Date().getMonth() + 1).length, '#f59e0b']].map(([label, value, color]) => (
          <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 10, marginBottom: 24, width: 'fit-content' }}>
        {['employees', 'payslips', 'departments'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#1e40af' : '#64748b', textTransform: 'capitalize', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>{t}</button>
        ))}
      </div>

      {tab === 'employees' && (
        <>
          <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' }} />
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Emp ID', 'Name', 'Designation', 'Department', 'Basic Salary', 'Allowances', 'Total', ''].map(h => <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#64748b' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {employees.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}><UserCheck size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />No employees found</td></tr>
                  : employees.map(e => (
                    <tr key={e.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '11px 14px', fontFamily: 'monospace', color: '#64748b', fontSize: 12 }}>{e.employee_id}</td>
                      <td style={{ padding: '11px 14px', fontWeight: 600 }}>{e.name}</td>
                      <td style={{ padding: '11px 14px', color: '#475569' }}>{e.designation || '-'}</td>
                      <td style={{ padding: '11px 14px' }}>{e.department ? <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{e.department}</span> : '-'}</td>
                      <td style={{ padding: '11px 14px', fontWeight: 600 }}>Rs. {e.basic_salary?.toLocaleString()}</td>
                      <td style={{ padding: '11px 14px', color: '#10b981' }}>Rs. {e.allowances?.toLocaleString()}</td>
                      <td style={{ padding: '11px 14px', fontWeight: 700, color: '#1e40af' }}>Rs. {(e.basic_salary + e.allowances).toLocaleString()}</td>
                      <td style={{ padding: '11px 14px' }}><button onClick={() => openEditEmp(e)} style={{ padding: '6px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}><Edit2 size={14} color="#3b82f6" /></button></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'payslips' && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Employee', 'Month/Year', 'Basic', 'Allowances', 'Overtime', 'Deductions', 'Tax', 'Net Salary', 'Status', ''].map(h => <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#64748b' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {payslips.length === 0 ? <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No payslips generated yet</td></tr>
                : payslips.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{p.employee}</td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>{MONTHS[p.month - 1]} {p.year}</td>
                    <td style={{ padding: '10px 14px' }}>Rs. {p.basic_salary?.toLocaleString()}</td>
                    <td style={{ padding: '10px 14px', color: '#10b981' }}>Rs. {p.allowances?.toLocaleString()}</td>
                    <td style={{ padding: '10px 14px' }}>Rs. {p.overtime?.toLocaleString()}</td>
                    <td style={{ padding: '10px 14px', color: '#ef4444' }}>Rs. {p.deductions?.toLocaleString()}</td>
                    <td style={{ padding: '10px 14px', color: '#ef4444' }}>Rs. {p.tax?.toLocaleString()}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1e40af' }}>Rs. {p.net_salary?.toLocaleString()}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ background: p.status === 'paid' ? '#d1fae5' : '#fef3c7', color: p.status === 'paid' ? '#065f46' : '#92400e', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{p.status.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      {p.status === 'pending' && <button onClick={() => markPaid(p.id)} style={{ padding: '5px 10px', background: '#d1fae5', border: 'none', borderRadius: 6, color: '#065f46', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Mark Paid</button>}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'departments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {departments.map(d => (
            <div key={d.id} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{d.name}</div>
              <div style={{ color: '#64748b', fontSize: 13, marginBottom: 12 }}>{d.description || 'No description'}</div>
              <div style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600, display: 'inline-block' }}>{d.employee_count} employees</div>
            </div>
          ))}
        </div>
      )}

      {showEmpModal && (
        <Modal title={editEmp ? 'Edit Employee' : 'Add Employee'} onClose={() => setShowEmpModal(false)} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Input label="Full Name *" value={empForm.name} onChange={e => setEmpForm({ ...empForm, name: e.target.value })} />
            <Input label="Employee ID *" value={empForm.employee_id} onChange={e => setEmpForm({ ...empForm, employee_id: e.target.value })} />
            <Input label="Phone" value={empForm.phone} onChange={e => setEmpForm({ ...empForm, phone: e.target.value })} />
            <Input label="Email" type="email" value={empForm.email} onChange={e => setEmpForm({ ...empForm, email: e.target.value })} />
            <Input label="CNIC" value={empForm.cnic} onChange={e => setEmpForm({ ...empForm, cnic: e.target.value })} />
            <Input label="Designation" value={empForm.designation} onChange={e => setEmpForm({ ...empForm, designation: e.target.value })} />
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 5 }}>Department</label>
              <select value={empForm.department_id} onChange={e => setEmpForm({ ...empForm, department_id: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#fff' }}>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div />
            <Input label="Basic Salary (Rs.)" type="number" value={empForm.basic_salary} onChange={e => setEmpForm({ ...empForm, basic_salary: e.target.value })} />
            <Input label="Allowances (Rs.)" type="number" value={empForm.allowances} onChange={e => setEmpForm({ ...empForm, allowances: e.target.value })} />
            <Input label="Deductions (Rs.)" type="number" value={empForm.deductions} onChange={e => setEmpForm({ ...empForm, deductions: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setShowEmpModal(false)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            <button onClick={saveEmployee} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Save Employee</button>
          </div>
        </Modal>
      )}

      {showPayslipModal && (
        <Modal title="Generate Payslip" onClose={() => setShowPayslipModal(false)}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 5 }}>Employee *</label>
            <select value={payslipForm.employee_id} onChange={e => setPayslipForm({ ...payslipForm, employee_id: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#fff' }}>
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.employee_id})</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 5 }}>Month</label>
              <select value={payslipForm.month} onChange={e => setPayslipForm({ ...payslipForm, month: parseInt(e.target.value) })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#fff' }}>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <Input label="Year" type="number" value={payslipForm.year} onChange={e => setPayslipForm({ ...payslipForm, year: parseInt(e.target.value) })} />
          </div>
          <Input label="Overtime (Rs.)" type="number" value={payslipForm.overtime} onChange={e => setPayslipForm({ ...payslipForm, overtime: parseFloat(e.target.value) || 0 })} />
          <Input label="Extra Deductions (Rs.)" type="number" value={payslipForm.extra_deductions} onChange={e => setPayslipForm({ ...payslipForm, extra_deductions: parseFloat(e.target.value) || 0 })} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setShowPayslipModal(false)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            <button onClick={generatePayslip} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Generate</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
