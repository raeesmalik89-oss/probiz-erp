import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, ShoppingCart, BookOpen, UserCheck, BarChart3, Shield,
  CheckCircle, Phone, Mail, MapPin, Menu, X,
  TrendingUp, Building2, Zap, Globe, ArrowRight,
  Play, Clock, ChevronRight, Layers, RefreshCw, FileText
} from 'lucide-react';

const features = [
  { icon: Package, title: 'Inventory Management', desc: 'Real-time stock tracking, low-stock alerts, product categories and multi-branch inventory control.', color: '#3b82f6' },
  { icon: ShoppingCart, title: 'POS & Sales', desc: 'Fast point-of-sale system with invoice generation, customer accounts and payment tracking.', color: '#10b981' },
  { icon: BookOpen, title: 'Accounting', desc: 'Complete chart of accounts, double-entry bookkeeping, P&L statements and balance sheet reports.', color: '#f59e0b' },
  { icon: UserCheck, title: 'HR & Payroll', desc: 'Employee management, attendance tracking, automated salary calculation and payslip generation.', color: '#8b5cf6' },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Business dashboards, sales trends, profit analysis and exportable reports for informed decisions.', color: '#ef4444' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Superadmin, manager, cashier and accountant roles with fine-grained permission control.', color: '#0ea5e9' },
  { icon: Building2, title: 'Multi-Branch', desc: 'Manage multiple branches from a single platform with centralized data and reporting.', color: '#f97316' },
  { icon: Globe, title: 'Cloud-Based', desc: 'Access your business data securely from any device, anywhere — no installation required.', color: '#6366f1' },
];

const industries = ['Pharmacies', 'Hospitals', 'Cash & Carry', 'Garment Stores', 'Spare Parts', 'Supermarkets', 'Clinics', 'Wholesale'];

const plans = [
  {
    name: 'Starter',
    price: '2,999',
    period: 'month',
    features: ['1 Branch', 'Up to 3 Users', 'Inventory & Sales', 'Basic Reports', 'Email Support'],
    popular: false
  },
  {
    name: 'Business',
    price: '7,999',
    period: 'month',
    features: ['Up to 3 Branches', 'Up to 10 Users', 'All Modules', 'Advanced Analytics', 'Priority Support', 'HR & Payroll'],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Unlimited Branches', 'Unlimited Users', 'All Modules', 'Custom Reports', 'Dedicated Support', 'API Access'],
    popular: false
  },
];

const whyUs = [
  { icon: Zap, title: 'Built for Pakistan', desc: 'Designed specifically for Pakistani businesses — PKR currency, local tax structures, Urdu-friendly interface.' },
  { icon: Layers, title: 'All-in-One Platform', desc: 'Replace 5+ separate tools with one system. Inventory, sales, accounting, payroll and analytics under one roof.' },
  { icon: RefreshCw, title: 'Real-Time Data', desc: 'Every transaction updates instantly across all modules. No manual reconciliation, no data lag.' },
  { icon: FileText, title: 'Instant Reports', desc: 'Generate profit & loss, balance sheet, stock valuation and payroll reports in seconds — not hours.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', business: '', phone: '', email: '', industry: '' });
  const [formSent, setFormSent] = useState(false);

  const handleDemo = (e) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0', padding: '0 5%',
        display: 'flex', alignItems: 'center', height: 68,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
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
            <a key={item} href={`#${item.toLowerCase()}`} style={{ textDecoration: 'none', color: '#475569', fontWeight: 500, fontSize: 15 }}
              onMouseEnter={e => e.target.style.color = '#1e40af'}
              onMouseLeave={e => e.target.style.color = '#475569'}
            >{item}</a>
          ))}
          <button onClick={() => navigate('/login')} style={{
            padding: '9px 22px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)',
            color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600,
            fontSize: 14, cursor: 'pointer',
          }}>Login to ERP</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '88vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)',
        padding: '80px 5%', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(139,92,246,0.08)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 480px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 24, padding: '6px 16px', marginBottom: 28 }}>
              <Zap size={14} color="#fbbf24" fill="#fbbf24" />
              <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>Complete Business Management for Pakistan</span>
            </div>
            <h1 style={{ fontSize: 'clamp(34px, 4.5vw, 60px)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 24 }}>
              Run Your Business<br />
              <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Smarter & Faster
              </span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: 40, maxWidth: 500 }}>
              ProBiz ERP is a complete business management platform built for Pakistani businesses.
              Manage inventory, sales, accounting, payroll and analytics — all in one place.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/login')} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '13px 30px', background: '#fff',
                color: '#1e40af', border: 'none', borderRadius: 10,
                fontWeight: 700, fontSize: 15, cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}>
                Try Free Demo <ArrowRight size={17} />
              </button>
              <a href="#contact" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '13px 26px', background: 'rgba(255,255,255,0.08)',
                color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer',
                textDecoration: 'none',
              }}>
                <Phone size={15} /> Contact Sales
              </a>
            </div>
          </div>

          {/* Feature highlights card */}
          <div style={{ flex: '1 1 340px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 400, backdropFilter: 'blur(12px)' }}>
              <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: 1, marginBottom: 20 }}>WHAT'S INCLUDED</div>
              {[
                ['Inventory & Stock Control', '#3b82f6'],
                ['POS & Sales Management', '#10b981'],
                ['Double-Entry Accounting', '#f59e0b'],
                ['HR & Payroll Module', '#8b5cf6'],
                ['Multi-Branch Support', '#f97316'],
                ['Role-Based Access Control', '#0ea5e9'],
                ['Analytics & Reports', '#ef4444'],
              ].map(([label, color]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{label}</span>
                  <CheckCircle size={14} color="#34d399" style={{ marginLeft: 'auto' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why ProBiz */}
      <section style={{ padding: '90px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-block', background: '#dbeafe', color: '#1e40af', padding: '4px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>WHY PROBIZ</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 14 }}>Designed for How You Work</h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 520, margin: '0 auto' }}>Built from the ground up for Pakistani business operations.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: '#f8fafc', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0' }}>
                <div style={{ width: 48, height: 48, background: '#dbeafe', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={24} color="#1e40af" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '90px 5%', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-block', background: '#dbeafe', color: '#1e40af', padding: '4px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>FEATURES</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 14 }}>Everything Your Business Needs</h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 520, margin: '0 auto' }}>A complete suite of tools built for businesses of all sizes across Pakistan.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0', transition: 'all 0.25s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 50, height: 50, background: color + '18', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={24} color={color} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" style={{ padding: '80px 5%', background: 'linear-gradient(135deg,#1e3a8a,#1e40af)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 14 }}>Suitable for Your Industry</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, marginBottom: 48 }}>ProBiz ERP adapts to the workflow of different business types</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            {industries.map(ind => (
              <div key={ind} style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 50, padding: '11px 22px', color: '#fff',
                fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <CheckCircle size={15} color="#34d399" /> {ind}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '90px 5%', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-block', background: '#dbeafe', color: '#1e40af', padding: '4px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>PRICING</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 14 }}>Simple, Transparent Pricing</h2>
            <p style={{ color: '#64748b', fontSize: 17 }}>No hidden charges. No setup fees. Cancel anytime.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, alignItems: 'center' }}>
            {plans.map(({ name, price, period, features, popular }) => (
              <div key={name} style={{
                background: popular ? 'linear-gradient(135deg,#1e3a8a,#2563eb)' : '#fff',
                borderRadius: 20, padding: 36,
                border: popular ? 'none' : '1px solid #e2e8f0',
                boxShadow: popular ? '0 20px 60px rgba(30,64,175,0.25)' : 'none',
                transform: popular ? 'scale(1.04)' : 'none',
                position: 'relative',
              }}>
                {popular && <div style={{ position: 'absolute', top: 16, right: 16, background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>POPULAR</div>}
                <div style={{ fontSize: 20, fontWeight: 700, color: popular ? '#fff' : '#1e293b', marginBottom: 8 }}>{name}</div>
                <div style={{ marginBottom: 28 }}>
                  {price !== 'Custom' ? (
                    <>
                      <span style={{ fontSize: 38, fontWeight: 900, color: popular ? '#fff' : '#1e40af' }}>Rs. {price}</span>
                      <span style={{ color: popular ? 'rgba(255,255,255,0.65)' : '#64748b', fontSize: 14 }}>/{period}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 38, fontWeight: 900, color: popular ? '#fff' : '#1e40af' }}>Custom</span>
                  )}
                </div>
                <ul style={{ listStyle: 'none', marginBottom: 32, padding: 0 }}>
                  {features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', color: popular ? 'rgba(255,255,255,0.85)' : '#475569', fontSize: 14 }}>
                      <CheckCircle size={15} color={popular ? '#34d399' : '#10b981'} />
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
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, marginTop: 32 }}>
            All plans include a free demo. Contact us to discuss your requirements before subscribing.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '90px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'inline-block', background: '#dbeafe', color: '#1e40af', padding: '4px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>CONTACT US</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Let's Talk About Your Business</h2>
            <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.75, marginBottom: 40 }}>
              Get in touch for a free demo or to discuss how ProBiz ERP can work for your business.
              We'll walk you through the system and answer all your questions.
            </p>
            {[
              [Phone, '0316-8818693', 'WhatsApp & Call'],
              [Mail, 'raees.malik89@gmail.com', 'Email us anytime'],
              [MapPin, 'House 124, Street 39, I-14/3, Islamabad', 'Head Office'],
            ].map(([Icon, value, label]) => (
              <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 22 }}>
                <div style={{ width: 46, height: 46, background: '#dbeafe', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color="#1e40af" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#1e293b' }}>{value}</div>
                  <div style={{ color: '#94a3b8', fontSize: 13 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 20, padding: 36, border: '1px solid #e2e8f0' }}>
            {formSent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle size={48} color="#10b981" style={{ marginBottom: 16 }} />
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Message Received!</h3>
                <p style={{ color: '#64748b', fontSize: 15 }}>We'll contact you within 24 hours to schedule your demo.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 6 }}>Request a Free Demo</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>We'll set up a live walkthrough for your team.</p>
                <form onSubmit={handleDemo}>
                  {[
                    ['Your Name', 'name', 'text'],
                    ['Business Name', 'business', 'text'],
                    ['Phone Number', 'phone', 'tel'],
                    ['Email Address', 'email', 'email'],
                  ].map(([placeholder, field, type]) => (
                    <input key={field} type={type} placeholder={placeholder} required
                      value={formData[field]}
                      onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, marginBottom: 12, outline: 'none', fontFamily: 'Inter, sans-serif', background: '#fff', boxSizing: 'border-box' }} />
                  ))}
                  <select required value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, marginBottom: 20, background: '#fff', fontFamily: 'Inter, sans-serif', color: formData.industry ? '#1e293b' : '#94a3b8' }}>
                    <option value="" disabled>Select Your Industry</option>
                    {industries.map(i => <option key={i}>{i}</option>)}
                  </select>
                  <button type="submit" style={{
                    width: '100%', padding: '13px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)',
                    color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  }}>
                    Request Free Demo →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.65)', padding: '48px 5% 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={17} color="#fff" />
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 19 }}>ProBiz ERP</span>
          </div>
          <p style={{ fontSize: 14, marginBottom: 6 }}>Complete business management software for Pakistani businesses.</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
            Dr Muhammad Raees RPh &nbsp;|&nbsp; raees.malik89@gmail.com &nbsp;|&nbsp; 0316-8818693 &nbsp;|&nbsp; Islamabad, Pakistan
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', fontSize: 13, flexWrap: 'wrap', gap: 10 }}>
            <span>© 2024 ProBiz ERP. All rights reserved.</span>
            <span>Made in Pakistan 🇵🇰</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
