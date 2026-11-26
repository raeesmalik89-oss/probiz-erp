import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SubscriptionGuard from './SubscriptionGuard';
import {
  LayoutDashboard, Package, ShoppingCart, Truck, Users, Building2,
  BookOpen, UserCheck, BarChart3, Settings, LogOut, Menu, X,
  Stethoscope, FileText, ChevronRight, CalendarDays, Sun, Moon, Sparkles, CalendarClock
} from 'lucide-react';

// Grouped navigation — like the medical dashboard reference.
const navGroups = [
  { title: 'Main', items: [
    { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/app/assistant', icon: Sparkles,        label: 'Ask MediCloud' },
  ]},
  { title: 'Operations', items: [
    { to: '/app/inventory',   icon: Package,       label: 'Inventory' },
    { to: '/app/near-expiry', icon: CalendarClock, label: 'Near Expiry' },
    { to: '/app/sales',       icon: ShoppingCart,  label: 'Sales / POS' },
    { to: '/app/purchases', icon: Truck,        label: 'Purchases' },
    { to: '/app/customers', icon: Users,        label: 'Customers' },
    { to: '/app/suppliers', icon: Building2,    label: 'Suppliers' },
  ]},
  { title: 'Finance & HR', items: [
    { to: '/app/accounting', icon: BookOpen,     label: 'Accounting' },
    { to: '/app/payroll',    icon: UserCheck,    label: 'HR & Payroll' },
    { to: '/app/attendance', icon: CalendarDays, label: 'Attendance' },
  ]},
  { title: 'Insights', items: [
    { to: '/app/reports',  icon: BarChart3, label: 'Reports' },
    { to: '/app/docs',     icon: FileText,  label: 'Documentation' },
    { to: '/app/settings', icon: Settings,  label: 'Settings' },
  ]},
];

function NavItem({ to, icon: Icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 group relative
        ${isActive
          ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300 font-semibold'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
        }`
      }
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-teal-500" />}
          <Icon size={18} className="shrink-0" />
          {!collapsed && <span className="truncate">{label}</span>}
          {collapsed && (
            <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const Sidebar = ({ mobile = false }) => {
    const compact = collapsed && !mobile;
    return (
      <aside className={`
        flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        ${mobile ? 'w-72' : collapsed ? 'w-[70px]' : 'w-64'}
        transition-all duration-300
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shrink-0 shadow-sm">
            <Stethoscope size={18} className="text-white" />
          </div>
          {(!collapsed || mobile) && (
            <div>
              <div className="text-slate-800 dark:text-white font-bold text-lg leading-none">MediCloud</div>
              <div className="text-slate-400 dark:text-slate-500 text-[11px] mt-0.5">Pharmacy & Business</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-thin">
          {navGroups.map(group => (
            <div key={group.title} className="mb-1">
              {!compact && (
                <p className="px-3 mt-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">
                  {group.title}
                </p>
              )}
              {compact && <div className="my-2 mx-3 border-t border-slate-100 dark:border-slate-800" />}
              {group.items.map(item => (
                <NavItem key={item.to} {...item} collapsed={compact} />
              ))}
            </div>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-2 py-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
          {(!collapsed || mobile) && (
            <div className="px-3 py-2.5 bg-teal-50/70 dark:bg-slate-800 rounded-xl mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {user?.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-slate-800 dark:text-slate-100 text-sm font-semibold truncate">{user?.name}</div>
                  <div className="text-slate-400 dark:text-slate-500 text-[11px] capitalize">{user?.role}</div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:text-rose-400 dark:hover:bg-rose-500/10 text-sm font-medium transition-colors"
          >
            <LogOut size={17} className="shrink-0" />
            {(!collapsed || mobile) && 'Logout'}
          </button>
        </div>
      </aside>
    );
  };

  return (
    <div className="flex h-screen bg-[#eef6f5] dark:bg-slate-950 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0" style={{ width: collapsed ? 70 : 256, transition: 'width 0.3s' }}>
        <Sidebar />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative flex h-full w-72">
            <Sidebar mobile />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-[-48px] w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 gap-3 shadow-sm shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu size={18} className="text-slate-600 dark:text-slate-300" />
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight size={18} className="text-slate-500 dark:text-slate-400" /> : <Menu size={18} className="text-slate-500 dark:text-slate-400" />}
          </button>

          <div className="flex-1" />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User badge */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-none">{user?.name}</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 capitalize mt-0.5">{user?.role}</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
          <SubscriptionGuard>
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </SubscriptionGuard>
        </main>
      </div>
    </div>
  );
}
