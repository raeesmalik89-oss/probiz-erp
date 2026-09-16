import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SubscriptionGuard from './SubscriptionGuard';
import {
  LayoutDashboard, Package, ShoppingCart, Truck, Users, Building2,
  BookOpen, UserCheck, BarChart3, Settings, LogOut, Menu, X,
  Briefcase, FileText, ChevronRight, CalendarDays
} from 'lucide-react';

const navItems = [
  { to: '/app/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/inventory',  icon: Package,         label: 'Inventory' },
  { to: '/app/sales',      icon: ShoppingCart,    label: 'Sales / POS' },
  { to: '/app/purchases',  icon: Truck,           label: 'Purchases' },
  { to: '/app/customers',  icon: Users,           label: 'Customers' },
  { to: '/app/suppliers',  icon: Building2,       label: 'Suppliers' },
  { to: '/app/accounting', icon: BookOpen,        label: 'Accounting' },
  { to: '/app/payroll',    icon: UserCheck,       label: 'HR & Payroll' },
  { to: '/app/attendance', icon: CalendarDays,    label: 'Attendance' },
  { to: '/app/reports',    icon: BarChart3,       label: 'Reports' },
  { to: '/app/docs',       icon: FileText,        label: 'Documentation' },
  { to: '/app/settings',   icon: Settings,        label: 'Settings' },
];

function NavItem({ to, icon: Icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 group relative
        ${isActive
          ? 'bg-white/20 text-white shadow-sm'
          : 'text-white/65 hover:bg-white/10 hover:text-white'
        }`
      }
      title={collapsed ? label : undefined}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {collapsed && (
        <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          {label}
        </span>
      )}
    </NavLink>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`
      flex flex-col h-full
      bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700
      ${mobile ? 'w-72' : collapsed ? 'w-[70px]' : 'w-64'}
      transition-all duration-300
    `}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Briefcase size={18} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div>
            <div className="text-white font-bold text-lg leading-none">ProBiz</div>
            <div className="text-white/50 text-[11px] mt-0.5">ERP System</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-thin">
        {navItems.map(item => (
          <NavItem key={item.to} {...item} collapsed={collapsed && !mobile} />
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-2 py-3 border-t border-white/10 space-y-1">
        {(!collapsed || mobile) && (
          <div className="px-3 py-2.5 bg-white/10 rounded-xl mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {user?.name?.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-semibold truncate">{user?.name}</div>
                <div className="text-white/50 text-[11px] capitalize">{user?.role}</div>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 text-sm font-medium transition-colors"
        >
          <LogOut size={17} className="shrink-0" />
          {(!collapsed || mobile) && 'Logout'}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
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
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shadow-sm shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={18} className="text-gray-600" />
          </button>

          {/* Desktop collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? <ChevronRight size={18} className="text-gray-500" /> : <Menu size={18} className="text-gray-500" />}
          </button>

          <div className="flex-1" />

          {/* User badge */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-gray-800 leading-none">{user?.name}</div>
              <div className="text-[11px] text-gray-400 capitalize mt-0.5">{user?.role}</div>
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
