import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Package, ShoppingCart, Truck, Users, Building2,
  BookOpen, UserCheck, BarChart3, Settings, LogOut, Menu, X,
  Bell, ChevronDown, Briefcase, TrendingUp, FileText
} from 'lucide-react';

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/inventory', icon: Package, label: 'Inventory' },
  { to: '/app/sales', icon: ShoppingCart, label: 'Sales / POS' },
  { to: '/app/purchases', icon: Truck, label: 'Purchases' },
  { to: '/app/customers', icon: Users, label: 'Customers' },
  { to: '/app/suppliers', icon: Building2, label: 'Suppliers' },
  { to: '/app/accounting', icon: BookOpen, label: 'Accounting' },
  { to: '/app/payroll', icon: UserCheck, label: 'HR & Payroll' },
  { to: '/app/reports', icon: BarChart3, label: 'Reports' },
  { to: '/app/docs', icon: FileText, label: 'Documentation' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '70px',
        background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease', overflow: 'hidden',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)', zIndex: 100, flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Briefcase size={20} color="#fff" />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, lineHeight: 1 }}>ProBiz</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>ERP System</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10, marginBottom: 4,
              textDecoration: 'none', color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
              background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              fontWeight: isActive ? 600 : 400, fontSize: 14,
              transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden',
            })}
              onMouseEnter={e => { if (!e.currentTarget.style.background.includes('0.2')) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { if (!e.currentTarget.className.includes('active')) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={19} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {sidebarOpen && (
            <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 10, marginBottom: 8 }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          )}
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            width: '100%', padding: '10px 12px', borderRadius: 10,
            background: 'rgba(239,68,68,0.2)', border: 'none',
            color: '#fca5a5', cursor: 'pointer', fontSize: 14, fontWeight: 500,
          }}>
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          height: 60, background: '#fff', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flexShrink: 0,
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)',
            background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {sidebarOpen ? <X size={18} color="#64748b" /> : <Menu size={18} color="#64748b" />}
          </button>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', background: '#f1f5f9', borderRadius: 8,
            cursor: 'pointer', fontSize: 14, color: 'var(--text)' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
              {user?.name?.charAt(0)}
            </div>
            <span style={{ fontWeight: 500 }}>{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
