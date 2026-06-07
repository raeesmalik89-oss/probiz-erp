import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, ShoppingCart, BookOpen, UserCheck, BarChart3, Shield,
  CheckCircle, Star, Phone, Mail, MapPin, ChevronRight, Menu, X,
  TrendingUp, Users, Building2, Zap, Globe, Lock, ArrowRight,
  Play, Award, Clock, HeartHandshake
} from 'lucide-react';

const features = [
  { icon: Package, title: 'Inventory Management', desc: 'Real-time stock tracking, barcode scanning, low-stock alerts and multi-branch inventory control.', color: '#3b82f6' },
  { icon: ShoppingCart, title: 'POS & Sales', desc: 'Fast point-of-sale system with invoice generation, customer accounts and payment tracking.', color: '#10b981' },
  { icon: BookOpen, title: 'Accounting', desc: 'Complete chart of accounts, double-entry bookkeeping, P&L and balance sheet reports.', color: '#f59e0b' },
  { icon: UserCheck, title: 'HR & Payroll', desc: 'Employee management, attendance tracking, automated salary calculation and payslip generation.', color: '#8b5cf6' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time dashboards, sales trends, profit analysis and data-driven business insights.', color: '#ef4444' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Superadmin, admin, manager, cashier, accountant roles with fine-grained permission control.', color: '#0ea5e9' },
  { icon: Building2, title: 'Multi-Branch', desc: 'Manage unlimited branches from a single platform with centralized reporting.', color: '#f97316' },
  { icon: Globe, title: 'Works Everywhere', desc: 'Cloud-ready, mobile-responsive interface accessible from any device, anywhere.', color: '#6366f1' },
];

const industries = ['Pharmacies', 'Hospitals', 'Cash & Carry', 'Garment Stores', 'Spare Parts', 'Supermarkets', 'Clinics', 'Restaurants'];

const testimonials = [
  { name: 'Dr. Imran Khan', role: 'CEO, City Hospital Lahore', text: 'ProBiz ERP transformed our pharmacy operations. Stock wastage dropped by 40% within 2 months. Outstanding system!', rating: 5 },
  { name: 'Muhammad Usman', role: 'Owner, Usman Cash & Carry', text: 'Managing 3 branches was a nightmare before ProBiz. Now I get real-time reports on my phone. Absolutely brilliant.', rating: 5 },
  { name: 'Sara Malik', role: 'CFO, Al-Shifa Pharmaceutical', text: 'The accounting module replaced our entire finance team\'s manual work. Reports that took days now take seconds.', rating: 5 },
];

const stats = [
  { value: '15K+', label: 'Active Users' },
  { value: '2K+', label: 'Happy Businesses' },
  { value: '70+', label: 'Modules' },
  { value: '99.9%', label: 'Uptime' },
];

const plans = [
  { name: 'Starter', price: '2,999', period: 'month', features: ['1 Branch', '3 Users', 'Inventory & Sales', 'Basic Reports', 'Email Support'], popular: false },
  { name: 'Business', price: '7,999', period: 'month', features: ['3 Branches', '10 Users', 'All Modules', 'Advanced Analytics', 'Priority Support', 'Payroll & HR'], popular: true },
  { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited Branches', 'Unlimited Users', 'All Modules', 'Custom Reports', 'Dedicated Manager', 'API Access', 'White Label'], popular: false },
];

export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0', padding: '0 5%',
        display: 'flex', alignItems: 'center', height: 68,
        boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 22, color: '#1e40af' }}>ProBiz</span>
          <span style={{ background: '#dbeafe', color: '#1e40af', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, letterSpacing: 1 }}>ERP</span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Features', 'Industries', 'Pricing', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ textDecoration: 'none', color: '#475569', fontWeight: 500, fontSize: 15, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#1e40af'}
              onMouseLeave={e => e.target.style.color = '#475569'}
            >{item}</a>
          ))}
          <button onClick={() => navigate('/login')} style={{
            padding: '9px 22px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)',
            color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600,
            fontSize: 14, cursor: 'pointer', transition: 'opacity 0.2s',
          }}>Login to ERP</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '92vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #1e40af 70%, #2563eb 100%)',
        position: 'relative', overflow: 'hidden', padding: '60px 5%',
      }}>
        {/* Decorative circles */}
        {[['-200px','-200px','600px','600px','rgba(59,130,246,0.15)'],
          ['auto','-100px','400px','400px','rgba(139,92,246,0.1)','0px'],
          ['auto','auto','300px','300px','rgba(16,185,129,0.08)','200px','100px']
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', top: c[0], left: c[1], right: c[5] || 'auto', bottom: c[6] || 'auto',
            width: c[2], height: c[3], borderRadius: '50%', background: c[4], pointerEvents: 'none',
          }} />
        ))}

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: 60 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 24, padding: '6px 16px', marginBottom: 24 }}>
              <Zap size={14} color="#fbbf24" fill="#fbbf24" />
              <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>Pakistan's Most Advanced Business ERP</span>
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 24 }}>
              Run Your Business<br />
              <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Smarter & Faster
              </span>
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
              ProBiz ERP is the all-in-one business management platform for Pakistani businesses. Inventory, Sales, Accounting, Payroll, and Analytics — all in one place.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/login')} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', background: '#fff',
                color: '#1e40af', border: 'none', borderRadius: 12,
                fontWeight: 700, fontSize: 16, cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              }}>
                Start Free Trial <ArrowRight size={18} />
              </button>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', background: 'rgba(255,255,255,0.1)',
                color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 12, fontWeight: 600, fontSize: 16, cursor: 'pointer',
              }}>
                <Play size={16} fill="#fff" /> Watch Demo
              </button>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 48, flexWrap: 'wrap' }}>
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{value}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Hero illustration card */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 420, backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Today's Revenue</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Live Dashboard</div>
                </div>
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#34d399', marginBottom: 4 }}>Rs. 1,24,560</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 20 }}>↑ 18.5% from yesterday</div>
              {[['Sales Today', '47 orders', '#3b82f6'],['Inventory Value', 'Rs. 8.4M', '#f59e0b'],['Pending Payroll', 'Rs. 3.2M', '#8b5cf6']].map(([label, val, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{label}</span>
                  <span style={{ color, fontWeight: 600, fontSize: 13 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 5%', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-block', background: '#dbeafe', color: '#1e40af', padding: '4px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>FEATURES</div>
            <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16 }}>Everything Your Business Needs</h2>
            <p style={{ fontSize: 18, color: '#64748b', maxWidth: 560, margin: '0 auto' }}>A complete suite of tools designed for Pakistani businesses of all sizes.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} style={{
                background: '#fff', borderRadius: 16, padding: 28,
                border: '1px solid #e2e8f0', transition: 'all 0.3s',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 52, height: 52, background: color + '18', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={26} color={color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" style={{ padding: '80px 5%', background: 'linear-gradient(135deg,#1e3a8a,#1e40af)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Built for Your Industry</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, marginBottom: 50 }}>Trusted by businesses across Pakistan in every sector</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            {industries.map(ind => (
              <div key={ind} style={{
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 50, padding: '12px 24px', color: '#fff',
                fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <CheckCircle size={16} color="#34d399" /> {ind}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12 }}>What Our Clients Say</h2>
            <p style={{ color: '#64748b', fontSize: 17 }}>2,000+ businesses trust ProBiz ERP across Pakistan</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {testimonials.map(({ name, role, text, rating }) => (
              <div key={name} style={{ background: '#f8fafc', borderRadius: 20, padding: 32, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array(rating).fill(0).map((_, i) => <Star key={i} size={18} color="#f59e0b" fill="#f59e0b" />)}
                </div>
                <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>"{text}"</p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{name}</div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '100px 5%', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12 }}>Simple, Transparent Pricing</h2>
            <p style={{ color: '#64748b', fontSize: 17 }}>No hidden charges. Cancel anytime.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
            {plans.map(({ name, price, period, features, popular }) => (
              <div key={name} style={{
                background: popular ? 'linear-gradient(135deg,#1e3a8a,#2563eb)' : '#fff',
                borderRadius: 20, padding: 36,
                border: popular ? 'none' : '1px solid #e2e8f0',
                boxShadow: popular ? '0 20px 60px rgba(30,64,175,0.3)' : 'none',
                transform: popular ? 'scale(1.04)' : 'none',
                position: 'relative', overflow: 'hidden',
              }}>
                {popular && <div style={{ position: 'absolute', top: 16, right: 16, background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>POPULAR</div>}
                <div style={{ fontSize: 20, fontWeight: 700, color: popular ? '#fff' : '#1e293b', marginBottom: 8 }}>{name}</div>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: popular ? '#fff' : '#1e40af' }}>
                    {price === 'Custom' ? '' : 'Rs. '}{price}
                  </span>
                  {period && <span style={{ color: popular ? 'rgba(255,255,255,0.7)' : '#64748b', fontSize: 15 }}>/{period}</span>}
                  {price === 'Custom' && <span style={{ fontSize: 40, fontWeight: 900, color: popular ? '#fff' : '#1e40af' }}>Custom</span>}
                </div>
                <ul style={{ listStyle: 'none', marginBottom: 32 }}>
                  {features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', color: popular ? 'rgba(255,255,255,0.85)' : '#475569', fontSize: 14 }}>
                      <CheckCircle size={16} color={popular ? '#34d399' : '#10b981'} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/login')} style={{
                  width: '100%', padding: '13px 0',
                  background: popular ? '#fff' : 'linear-gradient(135deg,#1e40af,#3b82f6)',
                  color: popular ? '#1e40af' : '#fff',
                  border: 'none', borderRadius: 10, fontWeight: 700,
                  fontSize: 15, cursor: 'pointer',
                }}>
                  {name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '100px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 16 }}>Get in Touch</h2>
            <p style={{ color: '#64748b', fontSize: 17, lineHeight: 1.7, marginBottom: 40 }}>Ready to transform your business? Contact our team for a free demo and consultation.</p>
            {[
              [Phone, '042-37426911 to 15', 'Call us anytime'],
              [Mail, 'info@probiz-erp.pk', 'Email support'],
              [MapPin, 'Lahore, Pakistan', 'Head Office'],
            ].map(([Icon, value, label]) => (
              <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, background: '#dbeafe', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} color="#1e40af" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{value}</div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 20, padding: 40, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Request a Free Demo</h3>
            {['Your Name', 'Business Name', 'Phone Number', 'Email Address'].map(placeholder => (
              <input key={placeholder} placeholder={placeholder} style={{
                width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0',
                borderRadius: 10, fontSize: 14, marginBottom: 14, outline: 'none',
                fontFamily: 'Inter, sans-serif', background: '#fff',
              }} />
            ))}
            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, marginBottom: 20, background: '#fff', fontFamily: 'Inter, sans-serif' }}>
              <option>Select Industry</option>
              {industries.map(i => <option key={i}>{i}</option>)}
            </select>
            <button style={{
              width: '100%', padding: '14px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: 'pointer',
            }}>
              Request Free Demo →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.7)', padding: '48px 5% 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="#fff" />
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>ProBiz ERP</span>
          </div>
          <p style={{ fontSize: 14, marginBottom: 24 }}>Pakistan's most advanced business management system.</p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', fontSize: 13, flexWrap: 'wrap', gap: 12 }}>
            <span>© 2024 ProBiz ERP. All rights reserved.</span>
            <span>Made with ❤️ in Pakistan</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
