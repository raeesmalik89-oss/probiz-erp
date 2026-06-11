import React, { useEffect, useState, useCallback } from 'react';
import API from '../api/client';
import { PageSpinner } from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import Pagination, { usePagination } from '../components/ui/Pagination';
import { exportCSV } from '../utils/csvExport';
import {
  CalendarDays, UserCheck, UserX, Clock, Download,
  Plus, Search, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  present:  { label: 'Present',  cls: 'badge-green'  },
  absent:   { label: 'Absent',   cls: 'badge-red'    },
  late:     { label: 'Late',     cls: 'badge-yellow' },
  half_day: { label: 'Half Day', cls: 'badge-blue'   },
  leave:    { label: 'Leave',    cls: 'badge-gray'   },
};

const monthName = (d) => d.toLocaleString('default', { month: 'long', year: 'numeric' });

export default function Attendance() {
  const today = new Date();
  const [viewDate, setViewDate]     = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [employees, setEmployees]   = useState([]);
  const [records, setRecords]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [modal, setModal]           = useState(null);
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [emp, att] = await Promise.all([
        API.get('/api/employees/'),
        API.get('/api/attendance/', { params: { year, month: month + 1 } }).catch(() => ({ data: [] })),
      ]);
      setEmployees(emp.data || []);
      setRecords(att.data || []);
    } catch {
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { load(); }, [load]);

  const getRecord = (empId, day) => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return records.find(r => r.employee_id === empId && r.date === date);
  };

  const filtered = employees.filter(e => {
    const matchSearch = !search || e.name?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const todayStr = today.toISOString().slice(0, 10);
  const todayRecords = records.filter(r => r.date === todayStr);
  const presentToday = todayRecords.filter(r => r.status === 'present').length;
  const absentToday  = todayRecords.filter(r => r.status === 'absent').length;
  const lateToday    = todayRecords.filter(r => r.status === 'late').length;

  const handleMarkBulk = async (status) => {
    if (!selectedDate) return toast.error('Select a date first');
    setSaving(true);
    try {
      await Promise.all(
        employees.map(e =>
          API.post('/api/attendance/', {
            employee_id: e.id,
            date: selectedDate,
            status,
            check_in: status === 'present' ? '09:00' : null,
            check_out: status === 'present' ? '17:00' : null,
          }).catch(() => null)
        )
      );
      toast.success(`Marked all as ${status}`);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (data.id) {
        await API.put(`/api/attendance/${data.id}`, data);
        toast.success('Record updated');
      } else {
        await API.post('/api/attendance/', data);
        toast.success('Record saved');
      }
      setModal(null);
      load();
    } catch {
      toast.error('Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const rows = employees.flatMap(e =>
      Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const rec = getRecord(e.id, day);
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return { Employee: e.name, Date: date, Status: rec?.status || '—', 'Check In': rec?.check_in || '', 'Check Out': rec?.check_out || '' };
      })
    );
    exportCSV(rows, `attendance-${year}-${month + 1}.csv`);
  };

  if (loading) return <PageSpinner text="Loading attendance..." />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Track employee attendance by month</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleExport} className="btn-secondary text-xs">
            <Download size={13} /> Export CSV
          </button>
          <button onClick={() => setModal({ mode: 'add', date: todayStr })} className="btn-primary text-xs">
            <Plus size={13} /> Mark Attendance
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Present Today', value: presentToday, icon: UserCheck, iconCls: 'text-emerald-600', bgCls: 'bg-emerald-50' },
          { label: 'Absent Today',  value: absentToday,  icon: UserX,     iconCls: 'text-red-500',     bgCls: 'bg-red-50' },
          { label: 'Late Today',    value: lateToday,    icon: Clock,     iconCls: 'text-amber-500',   bgCls: 'bg-amber-50' },
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

      {/* Controls */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Month nav */}
          <div className="flex items-center gap-2">
            <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1.5 rounded-lg hover:bg-gray-100">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-gray-700 w-40 text-center">{monthName(viewDate)}</span>
            <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1.5 rounded-lg hover:bg-gray-100">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-8 text-xs"
              placeholder="Search employee..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Bulk mark for selected date */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="input text-xs w-36"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            />
            <button
              onClick={() => handleMarkBulk('present')}
              disabled={saving}
              className="btn-primary text-xs px-3"
            >
              All Present
            </button>
            <button
              onClick={() => handleMarkBulk('absent')}
              disabled={saving}
              className="btn-danger text-xs px-3"
            >
              All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Monthly calendar grid */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-600 min-w-[140px] z-10">Employee</th>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const d = new Date(year, month, i + 1);
                  const isToday = d.toISOString().slice(0, 10) === todayStr;
                  return (
                    <th key={i} className={`px-2 py-3 text-center font-semibold min-w-[36px] ${isToday ? 'bg-blue-50 text-blue-700' : 'text-gray-500'}`}>
                      <div>{i + 1}</div>
                      <div className="font-normal text-[10px] text-gray-400">{d.toLocaleString('default', { weekday: 'short' })}</div>
                    </th>
                  );
                })}
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Present</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Absent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={daysInMonth + 3} className="text-center py-12 text-gray-400">No employees found</td></tr>
              ) : filtered.map((emp, idx) => {
                let presentCount = 0, absentCount = 0;
                return (
                  <tr key={emp.id} className={`border-b border-gray-50 ${idx % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                    <td className="sticky left-0 bg-inherit px-4 py-2.5 font-medium text-gray-800 z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px] shrink-0">
                          {emp.name?.charAt(0)}
                        </div>
                        <span className="truncate max-w-[100px]">{emp.name}</span>
                      </div>
                    </td>
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const rec = getRecord(emp.id, i + 1);
                      if (rec?.status === 'present') presentCount++;
                      else if (rec?.status === 'absent') absentCount++;
                      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                      const d = new Date(year, month, i + 1);
                      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                      return (
                        <td
                          key={i}
                          className={`px-1 py-2.5 text-center cursor-pointer transition-colors hover:bg-blue-50 ${isWeekend ? 'bg-gray-50/80' : ''}`}
                          onClick={() => setModal({ mode: 'edit', date, employee: emp, record: rec })}
                        >
                          {rec ? (
                            <span className={`inline-block w-6 h-6 rounded-md text-[9px] font-bold flex items-center justify-center ${
                              rec.status === 'present'  ? 'bg-emerald-100 text-emerald-700' :
                              rec.status === 'absent'   ? 'bg-red-100 text-red-600' :
                              rec.status === 'late'     ? 'bg-amber-100 text-amber-700' :
                              rec.status === 'half_day' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {rec.status === 'present' ? 'P' : rec.status === 'absent' ? 'A' : rec.status === 'late' ? 'L' : rec.status === 'half_day' ? 'H' : 'Lv'}
                            </span>
                          ) : (
                            <span className="text-gray-200">·</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-2.5 text-center font-bold text-emerald-600">{presentCount}</td>
                    <td className="px-4 py-2.5 text-center font-bold text-red-500">{absentCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark/Edit modal */}
      {modal && (
        <AttendanceModal
          modal={modal}
          employees={employees}
          saving={saving}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function AttendanceModal({ modal, employees, saving, onSave, onClose }) {
  const [form, setForm] = useState({
    employee_id: modal.employee?.id || '',
    date: modal.date || '',
    status: modal.record?.status || 'present',
    check_in: modal.record?.check_in || '09:00',
    check_out: modal.record?.check_out || '17:00',
    notes: modal.record?.notes || '',
    id: modal.record?.id || null,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal
      title={modal.record ? 'Edit Attendance Record' : 'Mark Attendance'}
      onClose={onClose}
      size="sm"
      footer={
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn-secondary text-xs">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving} className="btn-primary text-xs">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Employee</label>
          <select className="input text-sm" value={form.employee_id} onChange={e => set('employee_id', e.target.value)}>
            <option value="">Select employee...</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Date</label>
          <input type="date" className="input text-sm" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input text-sm" value={form.status} onChange={e => set('status', e.target.value)}>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        {(form.status === 'present' || form.status === 'late' || form.status === 'half_day') && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Check In</label>
              <input type="time" className="input text-sm" value={form.check_in} onChange={e => set('check_in', e.target.value)} />
            </div>
            <div>
              <label className="label">Check Out</label>
              <input type="time" className="input text-sm" value={form.check_out} onChange={e => set('check_out', e.target.value)} />
            </div>
          </div>
        )}
        <div>
          <label className="label">Notes (optional)</label>
          <textarea className="input text-sm resize-none" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any remarks..." />
        </div>
      </div>
    </Modal>
  );
}
