import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Package, ShoppingCart, BookOpen, UserCheck, BarChart3, Shield,
  CheckCircle, Phone, Mail, MapPin, Menu, X,
  TrendingUp, Building2, Zap, Globe, ArrowRight,
  Layers, RefreshCw, FileText
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'https://raees1989.pythonanywhere.com';

const features = [
  { icon: Package, title: 'Inventory Management', desc: 'Real-time stock tracking, low-stock alerts, product categories and multi-branch inventory control.', color: 'text-blue-600 bg-blue-50' },
  { icon: ShoppingCart, title: 'POS & Sales', desc: 'Fast point-of-sale system with invoice generation, customer accounts and payment tracking.', color: 'text-emerald-600 bg-emerald-50' },
  { icon: BookOpen, title: 'Accounting', desc: 'Complete chart of accounts, double-entry bookkeeping, P&L statements and balance sheet reports.', color: 'text-amber-600 bg-amber-50' },
  { icon: UserCheck, title: 'HR & Payroll', desc: 'Employee management, attendance tracking, automated salary calculation and payslip generation.', color: 'text-violet-600 bg-violet-50' },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Business dashboards, sales trends, profit analysis and exportable reports for informed decisions.', color: 'text-red-500 bg-red-50' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Superadmin, manager, cashier and accountant roles with fine-grained permission control.', color: 'text-sky-600 bg-sky-50' },
  { icon: Building2, title: 'Multi-Branch', desc: 'Manage multiple branches from a single platform with centralized data and reporting.', color: 'text-orange-600 bg-orange-50' },
  { icon: Globe, title: 'Cloud-Based', desc: 'Access your business data securely from any device, anywhere — no installation required.', color: 'text-indigo-600 bg-indigo-50' },
];

const industries = ['Pharmacies', 'Hospitals', 'Cash & Carry', 'Garment Stores', 'Spare Parts', 'Supermarkets', 'Clinics', 'Wholesale'];

const plans = [
  { name: 'Starter', price: '2,999', period: 'month', features: ['1 Branch', 'Up to 3 Users', 'Inventory & Sales', 'Basic Reports', 'Email Support'], popular: false },
  { name: 'Business', price: '7,999', period: 'month', features: ['Up to 3 Branches', 'Up to 10 Users', 'All Modules', 'Advanced Analytics', 'Priority Support', 'HR & Payroll'], popular: true },
  { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited Branches', 'Unlimited Users', 'All Modules', 'Custom Reports', 'Dedicated Support', 'API Access'], popular: false },
];

const whyUs = [
  { icon: Zap, title: 'Built for Pakistan', desc: 'Designed specifically for Pakistani businesses — PKR currency, local tax structures, Urdu-friendly interface.' },
  { icon: Layers, title: 'All-in-One Platform', desc: 'Replace 5+ separate tools with one system. Inventory, sales, accounting, payroll and analytics under one roof.' },
  { icon: RefreshCw, title: 'Real-Time Data', desc: 'Every transaction updates instantly across all modules. No manual reconciliation, no data lag.' },
  { icon: FileText, title: 'Instant Reports', desc: 'Generate profit & loss, balance sheet, stock valuation and payroll reports in seconds — not hours.' },
];

const navLinks = ['Features', 'Industries', 'Pricing', 'Contact'];

export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', business: '', phone: '', email: '', industry: '' });
  const [formSent, setFormSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleDemo = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axios.post(`${API_BASE}/api/demo/request`, formData);
    } catch (err) {
      console.error('Demo request error:', err);
    }
    setFormLoading(false);
    setFormSent(true);
  };

  const inputCls = 'w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';

  return (
    <div className="font-sans text-slate-800 overflow-x-hidden bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-[68px] flex items-center">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-[22px] text-blue-800">MediCloud</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest">ERP</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-slate-600 font-medium text-[15px] hover:text-blue-700 transition-colors">{item}</a>
            ))}
            <button onClick={() => navigate('/login')} className="px-5 py-2.5 bg-gradient-to-br from-blue-700 to-blue-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-blue-600/25 transition-all">
              Login to ERP
            </button>
          </div>
          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-5 py-4 flex flex-col gap-1">
            {navLinks.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="py-2.5 text-slate-700 font-medium hover:text-blue-700">{item}</a>
            ))}
            <button onClick={() => navigate('/login')} className="mt-2 px-5 py-2.5 bg-gradient-to-br from-blue-700 to-blue-500 text-white rounded-lg font-semibold text-sm">
              Login to ERP
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 px-5 py-20 md:py-28">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-blue-500/10 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-violet-500/10 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto flex items-center gap-14 flex-wrap">
          <div className="flex-1 min-w-[320px]">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-7">
              <Zap size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-slate-200 text-[13px] font-medium">Complete Business Management for Pakistan</span>
            </div>
            <h1 className="text-[clamp(34px,5vw,58px)] font-black text-white leading-[1.12] mb-6">
              Run Your Business<br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">Smarter &amp; Faster</span>
            </h1>
            <p className="text-[17px] text-white/70 leading-relaxed mb-10 max-w-lg">
              MediCloud is a complete business management platform built for Pakistani businesses.
              Manage inventory, sales, accounting, payroll and analytics — all in one place.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-7 py-3.5 bg-white text-blue-800 rounded-xl font-bold text-[15px] shadow-xl shadow-black/20 hover:-translate-y-0.5 transition-transform">
                Try Free Demo <ArrowRight size={17} />
              </button>
              <a href="#contact" className="flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white border border-white/25 rounded-xl font-semibold text-[15px] hover:bg-white/20 transition-colors">
                <Phone size={15} /> Contact Sales
              </a>
            </div>
          </div>

          <div className="flex-1 min-w-[300px] flex justify-center">
            <div className="bg-white/[0.06] border border-white/15 rounded-3xl p-7 w-full max-w-sm backdrop-blur-md">
              <div className="text-slate-400 text-xs font-semibold tracking-widest mb-5">WHAT'S INCLUDED</div>
              {[
                ['Inventory & Stock Control', 'bg-blue-500'],
                ['POS & Sales Management', 'bg-emerald-500'],
                ['Double-Entry Accounting', 'bg-amber-500'],
                ['HR & Payroll Module', 'bg-violet-500'],
                ['Multi-Branch Support', 'bg-orange-500'],
                ['Role-Based Access Control', 'bg-sky-500'],
                ['Analytics & Reports', 'bg-red-500'],
              ].map(([label, dot]) => (
                <div key={label} className="flex items-center gap-3 py-2.5 border-b border-white/[0.06] last:border-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  <span className="text-white/80 text-sm flex-1">{label}</span>
                  <CheckCircle size={14} className="text-emerald-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why MediCloud */}
      <section className="py-20 md:py-24 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeading tag="WHY MEDICLOUD" title="Designed for How You Work" subtitle="Built from the ground up for Pakistani business operations." />
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-50 rounded-2xl p-7 border border-slate-200">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={24} className="text-blue-700" />
                </div>
                <h3 className="text-[17px] font-bold mb-2.5">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-24 px-5 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeading tag="FEATURES" title="Everything Your Business Needs" subtitle="A complete suite of tools built for businesses of all sizes across Pakistan." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl p-7 border border-slate-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-[17px] font-bold mb-2.5">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-20 px-5 bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3.5">Suitable for Your Industry</h2>
          <p className="text-white/65 text-base mb-12">MediCloud adapts to the workflow of different business types</p>
          <div className="flex flex-wrap gap-3.5 justify-center">
            {industries.map(ind => (
              <div key={ind} className="bg-white/10 border border-white/20 rounded-full px-5 py-2.5 text-white font-semibold text-sm flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-400" /> {ind}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-24 px-5 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <SectionHeading tag="PRICING" title="Simple, Transparent Pricing" subtitle="No hidden charges. No setup fees. Cancel anytime." />
          <div className="grid gap-7 md:grid-cols-3 items-center">
            {plans.map(({ name, price, period, features: planFeatures, popular }) => (
              <div key={name} className={`rounded-3xl p-9 relative ${popular ? 'bg-gradient-to-br from-blue-900 to-blue-600 shadow-2xl shadow-blue-600/25 md:scale-105' : 'bg-white border border-slate-200'}`}>
                {popular && <div className="absolute top-4 right-4 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">POPULAR</div>}
                <div className={`text-xl font-bold mb-2 ${popular ? 'text-white' : 'text-slate-800'}`}>{name}</div>
                <div className="mb-7">
                  {price !== 'Custom' ? (
                    <>
                      <span className={`text-4xl font-black ${popular ? 'text-white' : 'text-blue-800'}`}>Rs. {price}</span>
                      <span className={popular ? 'text-white/65 text-sm' : 'text-slate-500 text-sm'}>/{period}</span>
                    </>
                  ) : (
                    <span className={`text-4xl font-black ${popular ? 'text-white' : 'text-blue-800'}`}>Custom</span>
                  )}
                </div>
                <ul className="space-y-2.5 mb-8">
                  {planFeatures.map(f => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${popular ? 'text-white/85' : 'text-slate-600'}`}>
                      <CheckCircle size={15} className={popular ? 'text-emerald-400' : 'text-emerald-500'} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/login')} className={`w-full py-3 rounded-xl font-bold text-[15px] transition-all ${popular ? 'bg-white text-blue-800 hover:bg-slate-100' : 'bg-gradient-to-br from-blue-700 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-600/25'}`}>
                  {name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm mt-8">
            All plans include a free demo. Contact us to discuss your requirements before subscribing.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 md:py-24 px-5 bg-white">
        <div className="max-w-5xl mx-auto grid gap-12 md:gap-16 md:grid-cols-2 items-start">
          <div>
            <SectionTag>CONTACT US</SectionTag>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-5 mb-4">Let's Talk About Your Business</h2>
            <p className="text-slate-500 text-base leading-relaxed mb-10">
              Get in touch for a free demo or to discuss how MediCloud can work for your business.
              We'll walk you through the system and answer all your questions.
            </p>
            {[
              [Phone, '0316-8818693', 'WhatsApp & Call'],
              [Mail, 'raees.malik89@gmail.com', 'Email us anytime'],
              [MapPin, 'House 124, Street 39, I-14/3, Islamabad', 'Head Office'],
            ].map(([Icon, value, label]) => (
              <div key={label} className="flex gap-4 mb-5">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-blue-700" />
                </div>
                <div>
                  <div className="font-semibold text-[15px] text-slate-800">{value}</div>
                  <div className="text-slate-400 text-[13px]">{label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 md:p-9 border border-slate-200">
            {formSent ? (
              <div className="text-center py-10">
                <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2.5">Message Received!</h3>
                <p className="text-slate-500 text-[15px]">We'll contact you within 24 hours to schedule your demo.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-1.5">Request a Free Demo</h3>
                <p className="text-slate-400 text-sm mb-6">We'll set up a live walkthrough for your team.</p>
                <form onSubmit={handleDemo} className="space-y-3">
                  {[
                    ['Your Name', 'name', 'text'],
                    ['Business Name', 'business', 'text'],
                    ['Phone Number', 'phone', 'tel'],
                    ['Email Address', 'email', 'email'],
                  ].map(([placeholder, field, type]) => (
                    <input key={field} type={type} placeholder={placeholder} required
                      value={formData[field]}
                      onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                      className={inputCls} />
                  ))}
                  <select required value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    className={`${inputCls} ${formData.industry ? 'text-slate-800' : 'text-slate-400'}`}>
                    <option value="" disabled>Select Your Industry</option>
                    {industries.map(i => <option key={i} className="text-slate-800">{i}</option>)}
                  </select>
                  <button type="submit" disabled={formLoading}
                    className="w-full py-3.5 bg-gradient-to-br from-blue-700 to-blue-500 text-white rounded-xl font-bold text-[15px] hover:shadow-lg hover:shadow-blue-600/25 transition-all disabled:opacity-70">
                    {formLoading ? 'Sending…' : 'Request Free Demo →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white/65 px-5 pt-12 pb-7">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp size={17} className="text-white" />
            </div>
            <span className="text-white font-extrabold text-lg">MediCloud</span>
          </div>
          <p className="text-sm mb-1.5">Complete business management software for Pakistani businesses.</p>
          <p className="text-[13px] text-white/40 mb-6">
            Dr Muhammad Raees RPh &nbsp;|&nbsp; raees.malik89@gmail.com &nbsp;|&nbsp; 0316-8818693 &nbsp;|&nbsp; Islamabad, Pakistan
          </p>
          <div className="border-t border-white/10 pt-5 flex justify-between text-[13px] flex-wrap gap-2.5">
            <span>© 2024 MediCloud. All rights reserved.</span>
            <span>Made in Pakistan 🇵🇰</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionTag({ children }) {
  return <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-[13px] font-semibold">{children}</div>;
}

function SectionHeading({ tag, title, subtitle }) {
  return (
    <div className="text-center mb-14">
      <SectionTag>{tag}</SectionTag>
      <h2 className="text-3xl md:text-[38px] font-extrabold mt-4 mb-3.5">{title}</h2>
      <p className="text-slate-500 text-[17px] max-w-xl mx-auto">{subtitle}</p>
    </div>
  );
}
