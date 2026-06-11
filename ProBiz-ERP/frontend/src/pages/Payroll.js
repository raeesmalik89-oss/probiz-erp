import React, { useEffect, useState } from 'react';
import API from '../api/client';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import Pagination, { usePagination } from '../components/ui/Pagination';
import { PageSpinner } from '../components/ui/Spinner';
import { exportCSV } from '../utils/csvExport';
import { Plus, Search, UserCheck, Edit2, Download, CheckCircle, DollarSign, Building2 } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

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

export default function Payroll() {
  const [tab, setTab]                   = useState('employees');
  const [employees, setEmployees]       = useState([]);
  const [departments, setDepartments]   = useState([]);
  const [payslips, setPayslips]         = useState([]);
  const [search, setSearch]             = useState('');
  const [loading, setLoading]           = useState(true);
  const [empModal, setEmpModal]         = useState(null);
  const [payslipModal, setPayslipModal] = useState(false);
  const [saving, setSaving]             = useState(false);
  const [empForm, setEmpForm]           = useState({ name: '', employee_id: '', email: '', phone: '', cnic: '', department_id: '', designation: '', basic_salary: '', allowances: '', deductions: '' });
  const [payslipForm, setPayslipForm]   = useState({ employee_id: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(), overtime: 0, extra_deductions: 0 });
  const setE = (k, v) => setEmpForm(f => ({ ...f, [k]: v }));
  const setP = (k, v) => setPayslipForm(f => ({ ...f, [k]: v }));

  const empPagination = usePagination(employees, 20);
  const payPagination = usePagination(payslips, 20);

  const load = async () => {
    setLoading(true);
    try {
      const [eRes, dRes, pRes] = await Promise.all([
        API.get('/api/payroll/employees', { params: search ? { search } : {} }),
        API.get('/api/payroll/departments'),
        API.get('/api/payroll/payslips'),
      ]);
      setEmployees(eRes.data);
      setDepartments(dRes.data);
      setPayslips(pRes.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search]);

  const openAddEmp  = () => { setEmpForm({ name: '', employee_id: `EMP-${String(employees.length + 1).padStart(3, '0')}`, email: '', phone: '', cnic: '', department_id: '', designation: '', basic_salary: '', allowances: 0, deductions: 0 }); setEmpModal('add'); };
  const openEditEmp = (e) => { setEmpForm({ name: e.name, employee_id: e.employee_id, email: '', phone: e.phone || '', cnic: '', department_id: e.department_id || '', designation: e.designation || '', basic_salary: e.basic_salary, allowances: e.allowances, deductions: '', _id: e.id }); setEmpModal('edit'); };

  const saveEmployee = async () => {
    if (!empForm.name || !empForm.employee_id) { toast.error('Name and Employee ID required'); return; }
    setSaving(true);
    try {
      const data = { ...empForm, department_id: empForm.department_id || null, basic_salary: parseFloat(empForm.basic_salary) || 0, allowances: parseFloat(empForm.allowances) || 0, deductions: parseFloat(empForm.deductions) || 0 };
      if (empModal === 'edit') { await API.put(`/api/payroll/employees/${empForm._id}`, data); toast.success('Employee updated'); }
      else { await API.post('/api/payroll/employees', data); toast.success('Employee added'); }
      setEmpModal(null); load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
    finally { setSaving(false); }
  };

  const generatePayslip = async () => {
    if (!payslipForm.employee_id) { toast.error('Select employee'); return; }
    setSaving(true);
    try {
      await API.post('/api/payroll/payslips/generate', { ...payslipForm, employee_id: parseInt(payslipForm.employee_id) });
      toast.success('Payslip generated'); setPayslipModal(false); load();
    } catch (e) { toast.error(e.response?.data?.detail || 'Error'); }
    finally { setSaving(false); }
  };

  const markPaid = async (id) => {
    try { await API.put(`/api/payroll/payslips/${id}/pay`); toast.success('Marked as paid'); load(); }
    catch { toast.error('Error'); }
  };

  const totalPayroll = employees.reduce((s, e) => s + e.basic_salary + e.allowances, 0);

  if (loading) return <PageSpinner text="Loading HR data..." />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">HR & Payroll</h1>
          <p className="page-subtitle">Employees, departments and salary management</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => exportCSV(employees.map(e => ({ ID: e.employee_id, Name: e.name, Designation: e.designation, Department: e.department, 'Basic Salary': e.basic_salary, Allowances: e.allowances, Total: e.basic_salary + e.allowances })), 'employees.csv')} className="btn-secondary text-xs">
            <Download size={13} /> Export
          </button>
          <button onClick={() => setPayslipModal(true)} className="btn-secondary text-xs">
            Generate Payslip
          </button>
          <button onClick={openAddEmp} className="btn-primary text-xs">
            <Plus size={14} /> Add Employee
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff',           value: employees.length,         icon: UserCheck,   iconCls: 'text-blue-600',   bgCls: 'bg-blue-50' },
          { label: 'Monthly Payroll',       value: `Rs. ${totalPayroll.toLocaleString()}`, icon: DollarSign, iconCls: 'text-violet-600', bgCls: 'bg-violet-50' },
          { label: 'Departments',           value: departments.length,       icon: Building2,   iconCls: 'text-emerald-600',bgCls: 'bg-emerald-50' },
          { label: 'Payslips This Month',   value: payslips.filter(p => p.month === new Date().getMonth() + 1).length, icon: CheckCircle, iconCls: 'text-amber-600', bgCls: 'bg-amber-50' },
        ].map(c => (
          <div key={c.label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.bgCls} flex items-center justify-center shrink-0`}>
              <c.icon size={18} className={c.iconCls} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <TabBar tabs={['employees', 'payslips', 'departments']} active={tab} onChange={setTab} />

      {/* Employees tab */}
      {tab === 'employees' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-8 text-sm" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>{['Emp ID', 'Name', 'Designation', 'Department', 'Basic Salary', 'Allowances', 'Total', ''].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
              </thead>
              <tbody>
                {empPagination.paginated.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400"><UserCheck size={36} className="mx-auto mb-2 opacity-30" />No employees found</td></tr>
                ) : empPagination.paginated.map(e => (
                  <tr key={e.id} className="table-row">
                    <td className="table-cell font-mono text-xs text-gray-500">{e.employee_id}</td>
                    <td className="table-cell font-semibold">{e.name}</td>
                    <td className="table-cell text-gray-600">{e.designation || '—'}</td>
                    <td className="table-cell">{e.department ? <span className="badge-blue">{e.department}</span> : '—'}</td>
                    <td className="table-cell font-semibold">Rs. {e.basic_salary?.toLocaleString()}</td>
                    <td className="table-cell text-emerald-600">Rs. {e.allowances?.toLocaleString()}</td>
                    <td className="table-cell font-bold text-blue-700">Rs. {(e.basic_salary + e.allowances).toLocaleString()}</td>
                    <td className="table-cell">
                      <button onClick={() => openEditEmp(e)} className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Edit2 size={13} className="text-blue-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={empPagination.page} total={empPagination.total} pageSize={empPagination.pageSize} onChange={empPagination.setPage} />
        </div>
      )}

      {/* Payslips tab */}
      {tab === 'payslips' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>{['Employee', 'Month/Year', 'Basic', 'Allowances', 'Overtime', 'Deductions', 'Net Salary', 'Status', ''].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
              </thead>
              <tbody>
                {payPagination.paginated.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-400">No payslips generated yet</td></tr>
                ) : payPagination.paginated.map(p => (
                  <tr key={p.id} className="table-row">
                    <td className="table-cell font-semibold">{p.employee}</td>
                    <td className="table-cell text-gray-500">{MONTHS[p.month - 1]} {p.year}</td>
                    <td className="table-cell">Rs. {p.basic_salary?.toLocaleString()}</td>
                    <td className="table-cell text-emerald-600">Rs. {p.allowances?.toLocaleString()}</td>
                    <td className="table-cell">Rs. {p.overtime?.toLocaleString()}</td>
                    <td className="table-cell text-red-500">Rs. {p.deductions?.toLocaleString()}</td>
                    <td className="table-cell font-bold text-blue-700">Rs. {p.net_salary?.toLocaleString()}</td>
                    <td className="table-cell">
                      <span className={p.status === 'paid' ? 'badge-green' : 'badge-yellow'}>{p.status?.toUpperCase()}</span>
                    </td>
                    <td className="table-cell">
                      {p.status === 'pending' && (
                        <button onClick={() => markPaid(p.id)} className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors">
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={payPagination.page} total={payPagination.total} pageSize={payPagination.pageSize} onChange={payPagination.setPage} />
        </div>
      )}

      {/* Departments tab */}
      {tab === 'departments' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {departments.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">No departments added yet</div>
          ) : departments.map(d => (
            <div key={d.id} className="card p-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                <Building2 size={18} className="text-blue-600" />
              </div>
              <p className="font-bold text-gray-900 mb-1">{d.name}</p>
              <p className="text-xs text-gray-500 mb-3">{d.description || 'No description'}</p>
              <span className="badge-blue">{d.employee_count} employees</span>
            </div>
          ))}
        </div>
      )}

      {/* Employee Modal */}
      {empModal && (
        <Modal title={empModal === 'edit' ? 'Edit Employee' : 'Add Employee'} onClose={() => setEmpModal(null)} size="lg"
          footer={<div className="flex gap-2 justify-end"><button onClick={() => setEmpModal(null)} className="btn-secondary text-xs">Cancel</button><button onClick={saveEmployee} disabled={saving} className="btn-primary text-xs">{saving ? 'Saving...' : 'Save Employee'}</button></div>}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {[['Full Name *', 'name', 'text'], ['Employee ID *', 'employee_id', 'text'], ['Phone', 'phone', 'tel'], ['Email', 'email', 'email'], ['CNIC', 'cnic', 'text'], ['Designation', 'designation', 'text']].map(([label, key, type]) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input type={type} className="input text-sm" value={empForm[key] || ''} onChange={e => setE(key, e.target.value)} />
              </div>
            ))}
            <div>
              <label className="label">Department</label>
              <select className="input text-sm" value={empForm.department_id} onChange={e => setE('department_id', e.target.value)}>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div />
            {[['Basic Salary (Rs.)', 'basic_salary'], ['Allowances (Rs.)', 'allowances'], ['Deductions (Rs.)', 'deductions']].map(([label, key]) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input type="number" className="input text-sm" value={empForm[key] || ''} onChange={e => setE(key, e.target.value)} />
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Payslip Modal */}
      {payslipModal && (
        <Modal title="Generate Payslip" onClose={() => setPayslipModal(false)} size="sm"
          footer={<div className="flex gap-2 justify-end"><button onClick={() => setPayslipModal(false)} className="btn-secondary text-xs">Cancel</button><button onClick={generatePayslip} disabled={saving} className="btn-primary text-xs">{saving ? 'Generating...' : 'Generate'}</button></div>}>
          <div className="space-y-3">
            <div>
              <label className="label">Employee *</label>
              <select className="input text-sm" value={payslipForm.employee_id} onChange={e => setP('employee_id', e.target.value)}>
                <option value="">Select Employee</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.employee_id})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Month</label>
                <select className="input text-sm" value={payslipForm.month} onChange={e => setP('month', parseInt(e.target.value))}>
                  {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Year</label>
                <input type="number" className="input text-sm" value={payslipForm.year} onChange={e => setP('year', parseInt(e.target.value))} />
              </div>
            </div>
            <div>
              <label className="label">Overtime (Rs.)</label>
              <input type="number" className="input text-sm" value={payslipForm.overtime} onChange={e => setP('overtime', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className="label">Extra Deductions (Rs.)</label>
              <input type="number" className="input text-sm" value={payslipForm.extra_deductions} onChange={e => setP('extra_deductions', parseFloat(e.target.value) || 0)} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
