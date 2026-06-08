import React, { useState } from 'react';
import {
  BookOpen, LayoutDashboard, Package, ShoppingCart, Truck, Users,
  Building2, UserCheck, BarChart3, Settings, Shield, ChevronRight,
  ChevronDown, Zap, Lock, RefreshCw, Globe, Database, AlertTriangle,
  CheckCircle, FileText, DollarSign, Clock, Hash, ArrowRight, Search,
  TrendingUp, Layers
} from 'lucide-react';

const sections = [
  {
    id: 'overview', icon: Zap, label: 'System Overview', color: '#1e40af',
    content: {
      title: 'ProBiz ERP — System Overview',
      subtitle: 'A complete cloud-based Enterprise Resource Planning system built for Pakistani businesses.',
      body: [
        {
          heading: 'What is ProBiz ERP?',
          text: `ProBiz ERP is an all-in-one business management platform that connects every part of your business — inventory, sales, purchasing, accounting, HR and payroll — into a single real-time system. Instead of running separate software for each department, everything talks to each other automatically.`
        },
        {
          heading: 'How it is Advanced',
          bullets: [
            'Double-entry accounting engine — every transaction auto-posts to the correct ledger accounts',
            'Real-time inventory — stock levels update instantly on every sale or purchase',
            'Multi-branch architecture — run Islamabad, Lahore, Karachi branches from one dashboard',
            'Role-based access control — 5 roles with different permissions (superadmin, admin, manager, cashier, accountant)',
            'JWT authentication — secure access tokens + refresh tokens for session management',
            'RESTful API — every module exposed via FastAPI, documented at /docs',
            'Cloud-hosted — accessible from any browser, any device, anywhere in Pakistan',
            'Automated invoice numbering — INV-YYYYMM-XXXXX format with no gaps',
            'Profit tracking — cost price vs sale price margin calculated per product and per invoice',
            'Receivables & Payables — customer credit limits, outstanding balances, aging reports',
          ]
        },
        {
          heading: 'Technology Stack',
          table: {
            headers: ['Layer', 'Technology', 'Purpose'],
            rows: [
              ['Backend', 'FastAPI (Python)', 'REST API, business logic, authentication'],
              ['Database', 'SQLite / PostgreSQL', 'Data storage with SQLAlchemy ORM'],
              ['Frontend', 'React 18', 'User interface, dashboards, forms'],
              ['Charts', 'Recharts', 'Sales charts, bar graphs, pie charts'],
              ['Auth', 'JWT (jose)', 'Secure login with access + refresh tokens'],
              ['Hosting', 'Railway (backend)', 'Auto-deploy from GitHub, always online'],
              ['Hosting', 'Vercel (frontend)', 'Global CDN, free tier, instant deploy'],
            ]
          }
        },
        {
          heading: 'Login Credentials',
          table: {
            headers: ['Role', 'Email', 'Password'],
            rows: [
              ['Superadmin', 'raees.malik89@gmail.com', 'admin123'],
              ['Manager', 'manager@probiz.pk', 'manager123'],
              ['Cashier', 'cashier@probiz.pk', 'cashier123'],
              ['Accountant', 'accountant@probiz.pk', 'acc123'],
            ]
          }
        }
      ]
    }
  },
  {
    id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#3b82f6',
    content: {
      title: 'Dashboard',
      subtitle: 'Real-time business overview at a glance.',
      body: [
        {
          heading: 'What you see on the Dashboard',
          bullets: [
            "Today's Sales — total revenue from all completed sales today",
            'Month Revenue — cumulative sales for the current calendar month',
            'Total Products — number of products in inventory with low-stock alert count',
            'Customers — total customer accounts with total outstanding receivables',
            'Suppliers — total suppliers with total outstanding payables',
            'Employees — number of active staff members',
          ]
        },
        {
          heading: 'Charts',
          bullets: [
            'Sales — Last 7 Days: Area chart showing daily sales trend for the past week',
            'Top Products: Pie chart of best-selling products by revenue this month',
            'Sales vs Purchases (6 Months): Bar chart comparing monthly sales and purchase totals',
            'Recent Sales: Live table of the latest invoices with customer, amount and status',
          ]
        },
        {
          heading: 'Low Stock Alerts',
          text: 'If any product falls below its minimum stock level, a yellow warning panel appears at the bottom of the dashboard showing the product name, current stock, and minimum threshold. This lets you reorder before you run out.'
        }
      ]
    }
  },
  {
    id: 'inventory', icon: Package, label: 'Inventory', color: '#10b981',
    content: {
      title: 'Inventory Management',
      subtitle: 'Track every product, category and stock movement in real time.',
      body: [
        {
          heading: 'Adding a Product',
          steps: [
            'Go to Inventory from the sidebar',
            'Click the "Add Product" button (top right)',
            'Fill in: Name, SKU (unique code), Category, Unit, Cost Price, Sale Price, Opening Stock, Minimum Stock',
            'Save — the product is immediately available in POS and Purchase Order screens',
          ]
        },
        {
          heading: 'Product Fields Explained',
          table: {
            headers: ['Field', 'Description', 'Example'],
            rows: [
              ['SKU', 'Unique product code for quick lookup', 'MED001'],
              ['Unit', 'How the product is measured/sold', 'strips, pcs, kg, box'],
              ['Cost Price', 'What you paid to the supplier (Rs.)', 'Rs. 80'],
              ['Sale Price', 'What you charge the customer (Rs.)', 'Rs. 100'],
              ['Stock', 'Current quantity in stock', '50'],
              ['Min Stock', 'Alert threshold — warns when stock drops below this', '10'],
            ]
          }
        },
        {
          heading: 'How Stock Updates Automatically',
          bullets: [
            'When a sale is made → stock decreases by the sold quantity instantly',
            'When a purchase is received → stock increases by the received quantity instantly',
            'No manual stock adjustment needed for normal buy/sell operations',
            'Low stock alert fires on dashboard when stock < min_stock',
          ]
        },
        {
          heading: 'Categories',
          text: 'Products are organized into categories (Medicines, Surgical, Cosmetics, Vitamins etc.). You can filter the product list by category for faster searching. Categories also help in reports — you can see which category contributes most to revenue.'
        }
      ]
    }
  },
  {
    id: 'sales', icon: ShoppingCart, label: 'Sales / POS', color: '#f59e0b',
    content: {
      title: 'Sales & Point of Sale',
      subtitle: 'Process sales, generate invoices, track payments and manage customer credit.',
      body: [
        {
          heading: 'Creating a Sale',
          steps: [
            'Go to Sales / POS from the sidebar',
            'Click "New Sale"',
            'Select or search customer (or use "Walk-in Customer" for cash sales)',
            'Add products by searching and entering quantity',
            'Apply discount if any (per item or overall)',
            'Select payment method: Cash, Card, Bank Transfer, or Credit',
            'Click Complete Sale — invoice is generated instantly',
          ]
        },
        {
          heading: 'Invoice Numbering',
          text: 'Every invoice gets a unique number in the format INV-YYYYMM-NNNNN (e.g. INV-202606-00001). This makes it easy to reference any invoice by date and sequence. Numbers never repeat or have gaps.'
        },
        {
          heading: 'Payment Methods',
          table: {
            headers: ['Method', 'How it works'],
            rows: [
              ['Cash', 'Full payment received immediately. Balance = 0.'],
              ['Card', 'Full payment by debit/credit card. Balance = 0.'],
              ['Bank Transfer', 'Payment via bank. Balance = 0.'],
              ['Credit', 'Sale on credit — added to customer receivables. Balance = full amount until paid.'],
            ]
          }
        },
        {
          heading: 'Sales on Credit',
          text: 'If you select Credit as the payment method, the sale is recorded but the amount is added to the customer\'s outstanding balance. The customer\'s credit limit is checked — if they exceed it, a warning is shown. You can record partial payments against credit invoices later.'
        },
        {
          heading: 'What Happens Behind the Scenes',
          bullets: [
            'Stock of each sold product decreases immediately',
            'Invoice is saved with all line items, prices, discounts and totals',
            'If Credit: customer receivable balance increases',
            'Profit margin is calculated (sale price − cost price × quantity)',
            'Dashboard charts and stats update in real time',
          ]
        }
      ]
    }
  },
  {
    id: 'purchases', icon: Truck, label: 'Purchases', color: '#8b5cf6',
    content: {
      title: 'Purchase Management',
      subtitle: 'Record supplier purchases, receive stock and track what you owe.',
      body: [
        {
          heading: 'Creating a Purchase Order',
          steps: [
            'Go to Purchases from the sidebar',
            'Click "New Purchase"',
            'Select supplier',
            'Add products and quantities being ordered',
            'Enter cost prices (may differ from stock cost price)',
            'Select payment method — Cash means paid now, Credit means payable later',
            'Save the purchase',
          ]
        },
        {
          heading: 'What Happens When Purchase is Saved',
          bullets: [
            'Stock of each purchased product increases immediately',
            'If Credit: supplier payable balance increases',
            'Purchase order gets a PO number (PO-YYYYMM-NNNNN)',
            'Cost prices can optionally update product cost prices for future margin calculations',
          ]
        },
        {
          heading: 'Payables Tracking',
          text: 'All credit purchases are tracked as Accounts Payable. You can see the total amount owed to each supplier on the Suppliers page. When you pay a supplier, you record the payment which reduces the payable balance.'
        }
      ]
    }
  },
  {
    id: 'customers', icon: Users, label: 'Customers', color: '#ef4444',
    content: {
      title: 'Customer Management',
      subtitle: 'Maintain customer accounts, credit limits and payment history.',
      body: [
        {
          heading: 'Customer Fields',
          table: {
            headers: ['Field', 'Description'],
            rows: [
              ['Name', 'Full name of customer or business'],
              ['Phone', 'Contact number'],
              ['Email', 'Email address (optional)'],
              ['City', 'City for delivery/records'],
              ['Credit Limit', 'Maximum credit allowed (Rs.). 0 = no credit.'],
              ['Balance', 'Current outstanding amount owed by customer'],
            ]
          }
        },
        {
          heading: 'Credit Management',
          bullets: [
            'Each customer has a credit limit you set',
            'When a sale on credit is made, the balance increases',
            'When payment is received, balance decreases',
            'If a new credit sale would exceed the limit, a warning appears',
            'Receivables report shows all customers with outstanding balances',
          ]
        },
        {
          heading: 'Customer Purchase History',
          text: 'Every invoice linked to a customer is visible in their record. You can see total purchases, total paid, and outstanding balance at any time.'
        }
      ]
    }
  },
  {
    id: 'suppliers', icon: Building2, label: 'Suppliers', color: '#0ea5e9',
    content: {
      title: 'Supplier Management',
      subtitle: 'Track all your suppliers, purchases and outstanding payables.',
      body: [
        {
          heading: 'Supplier Fields',
          table: {
            headers: ['Field', 'Description'],
            rows: [
              ['Company Name', 'Supplier business name'],
              ['Contact Person', 'Main contact at the supplier'],
              ['Phone / Email', 'Contact details'],
              ['City', 'Supplier location'],
              ['Balance', 'Amount currently owed to this supplier'],
            ]
          }
        },
        {
          heading: 'Payables Tracking',
          text: 'Every credit purchase from a supplier increases their payable balance. Record payments to reduce the balance. The Suppliers list shows total payable at a glance so you know who to pay first.'
        }
      ]
    }
  },
  {
    id: 'accounting', icon: BookOpen, label: 'Accounting', color: '#f97316',
    content: {
      title: 'Accounting Module',
      subtitle: 'Double-entry bookkeeping, chart of accounts, and financial statements.',
      body: [
        {
          heading: 'Chart of Accounts',
          text: 'ProBiz uses a standard chart of accounts with 5 account types. Every financial transaction is recorded against two accounts (debit and credit) following double-entry bookkeeping principles — the cornerstone of professional accounting.'
        },
        {
          heading: 'Account Types',
          table: {
            headers: ['Type', 'Examples', 'Normal Balance'],
            rows: [
              ['Asset', 'Cash, Bank, Inventory, Receivables', 'Debit'],
              ['Liability', 'Accounts Payable, Loans', 'Credit'],
              ['Equity', "Owner's Equity, Retained Earnings", 'Credit'],
              ['Income', 'Sales Revenue, Other Income', 'Credit'],
              ['Expense', 'Cost of Goods Sold, Salaries, Rent', 'Debit'],
            ]
          }
        },
        {
          heading: 'Journal Entries',
          text: 'Every sale, purchase, and payment automatically generates the correct journal entries. For example, a cash sale of Rs. 1,000 auto-creates: Debit Cash Rs. 1,000 / Credit Sales Revenue Rs. 1,000. You can also create manual journal entries for adjustments, depreciation, etc.'
        },
        {
          heading: 'Financial Reports Available',
          bullets: [
            'Trial Balance — all account balances to verify books are balanced',
            'Profit & Loss Statement — income minus expenses for any period',
            'Balance Sheet — assets, liabilities and equity at any date',
            'General Ledger — full transaction history for any account',
          ]
        }
      ]
    }
  },
  {
    id: 'payroll', icon: UserCheck, label: 'HR & Payroll', color: '#6366f1',
    content: {
      title: 'HR & Payroll Module',
      subtitle: 'Employee management, attendance tracking and automated payslip generation.',
      body: [
        {
          heading: 'Employee Setup',
          steps: [
            'Go to HR & Payroll',
            'Add Employee — enter name, employee ID, department, designation',
            'Set Basic Salary, Allowances and Deductions',
            'Assign to a branch',
            'Mark as Active',
          ]
        },
        {
          heading: 'Salary Structure',
          table: {
            headers: ['Component', 'Description'],
            rows: [
              ['Basic Salary', 'Fixed monthly base pay'],
              ['Allowances', 'House rent, transport, medical etc.'],
              ['Deductions', 'EOBI, income tax, loan repayment etc.'],
              ['Net Salary', 'Basic + Allowances − Deductions'],
            ]
          }
        },
        {
          heading: 'Payroll Processing',
          steps: [
            'Go to HR & Payroll → Process Payroll',
            'Select the month and year',
            'System calculates net salary for every active employee automatically',
            'Review and confirm — payslips are generated for all employees',
            'Payslips can be printed or shared with employees',
          ]
        },
        {
          heading: 'Attendance',
          text: 'Mark daily attendance for each employee (Present, Absent, Half Day, Leave). Attendance records are linked to payroll — absent days can be deducted from salary based on your policy.'
        }
      ]
    }
  },
  {
    id: 'reports', icon: BarChart3, label: 'Reports', color: '#ec4899',
    content: {
      title: 'Reports & Analytics',
      subtitle: 'Every business metric you need, generated instantly.',
      body: [
        {
          heading: 'Available Reports',
          table: {
            headers: ['Report', 'What it shows'],
            rows: [
              ['Sales Report', 'All invoices filtered by date range, customer, status'],
              ['Purchase Report', 'All purchase orders filtered by date, supplier'],
              ['Inventory Report', 'Current stock levels, low stock, stock valuation'],
              ['Profit & Loss', 'Revenue, cost of goods, gross/net profit for a period'],
              ['Balance Sheet', 'Assets, liabilities, equity snapshot'],
              ['Receivables Report', 'Customers with outstanding balances and aging'],
              ['Payables Report', 'Suppliers with outstanding payables and aging'],
              ['Payroll Report', 'Monthly payroll summary per employee'],
              ['Top Products', 'Best selling products by quantity and revenue'],
              ['Sales by Customer', 'Revenue breakdown per customer'],
            ]
          }
        },
        {
          heading: 'Date Range Filtering',
          text: 'All reports can be filtered by custom date range — today, this week, this month, this year, or any custom from/to dates. This lets you generate reports for any time period your accountant or auditor requires.'
        },
        {
          heading: 'Export',
          text: 'Reports can be printed directly from the browser (File → Print → Save as PDF). Full CSV/Excel export feature is on the roadmap for the next version.'
        }
      ]
    }
  },
  {
    id: 'security', icon: Shield, label: 'Security & Roles', color: '#64748b',
    content: {
      title: 'Security & Role-Based Access',
      subtitle: 'Five roles with carefully designed permissions so each user sees only what they need.',
      body: [
        {
          heading: 'User Roles',
          table: {
            headers: ['Role', 'Who it is for', 'Key Permissions'],
            rows: [
              ['Superadmin', 'Business owner', 'Full access — all modules, settings, reset, user management'],
              ['Admin', 'General manager', 'All modules except system reset and security settings'],
              ['Manager', 'Branch manager', 'Inventory, sales, purchases, reports — no payroll or accounts'],
              ['Cashier', 'Sales counter staff', 'Create sales and view own invoices only'],
              ['Accountant', 'Finance staff', 'Accounting module and financial reports only'],
            ]
          }
        },
        {
          heading: 'Authentication',
          bullets: [
            'JWT (JSON Web Token) authentication — industry standard',
            'Access token expires after 1 hour — forces re-login for abandoned sessions',
            'Refresh token — automatically refreshes access without requiring password again',
            'Passwords are hashed using bcrypt — never stored in plain text',
            'All API endpoints require a valid Bearer token — direct URL access is blocked',
          ]
        },
        {
          heading: 'API Security',
          text: 'Every API endpoint requires authentication. Role checks are enforced server-side — even if someone bypasses the frontend UI, they cannot call restricted endpoints without the correct role token. CORS is configured to only allow your specific frontend domain.'
        }
      ]
    }
  },
  {
    id: 'multibranch', icon: Layers, label: 'Multi-Branch', color: '#14b8a6',
    content: {
      title: 'Multi-Branch Management',
      subtitle: 'Run multiple business locations from a single ProBiz account.',
      body: [
        {
          heading: 'How Multi-Branch Works',
          text: 'Every record in ProBiz (products, sales, purchases, employees) is linked to a branch. A superadmin can see data from all branches in consolidated reports. Branch managers and cashiers only see data for their own branch.'
        },
        {
          heading: 'Branch-Level Data',
          bullets: [
            'Each branch has its own inventory stock levels',
            'Sales and purchases are recorded per branch',
            'Employees and payroll are per branch',
            'Consolidated reports combine all branches for the owner',
          ]
        },
        {
          heading: 'Setting Up a New Branch',
          steps: [
            'Go to Settings (superadmin only)',
            'Add branch with name, city, address, phone',
            'Create user accounts assigned to the new branch',
            'Add products and opening stock for the new branch',
          ]
        }
      ]
    }
  },
  {
    id: 'faq', icon: Hash, label: 'FAQ', color: '#a855f7',
    content: {
      title: 'Frequently Asked Questions',
      subtitle: 'Common questions about using ProBiz ERP.',
      body: [
        {
          heading: 'Can I use ProBiz on my mobile phone?',
          text: 'Yes. ProBiz ERP is a web application accessible from any browser including Chrome on Android and Safari on iPhone. The layout is responsive — it works on both desktop and mobile, though desktop gives the best experience for data entry.'
        },
        {
          heading: 'What happens to my data if I close the browser?',
          text: 'All data is saved to the cloud database on Railway servers instantly when you click Save or Complete. Closing the browser has no effect — your data is always there when you log back in.'
        },
        {
          heading: 'Can multiple users log in at the same time?',
          text: 'Yes. ProBiz supports concurrent users. A cashier can be making a sale while the accountant is running reports and the manager is checking inventory — all at the same time with no conflicts.'
        },
        {
          heading: 'How do I add my real products and remove demo data?',
          text: 'Go to Settings → "Reset to Clean Demo" — this wipes all demo records and gives you a clean system with just 3 sample records to show you how it works. Then go to Inventory and add your real products one by one, or contact us to help you bulk import from Excel.'
        },
        {
          heading: 'Is my data backed up?',
          text: 'Data is stored on Railway\'s cloud infrastructure. For additional safety, we recommend setting up a PostgreSQL database (instead of the default SQLite) which includes automatic daily backups. Contact us to upgrade your database.'
        },
        {
          heading: 'Can I print invoices?',
          text: 'Yes. Open any sale invoice and use your browser\'s Print function (Ctrl+P or Cmd+P). A print-optimized layout hides the sidebar and header. Full PDF invoice generation with your logo and letterhead is on the roadmap.'
        },
        {
          heading: 'What is the difference between Cost Price and Sale Price?',
          text: 'Cost Price is what you paid the supplier to buy the product. Sale Price is what you charge your customer. The difference is your profit margin. ProBiz tracks both so it can calculate your real profit per sale automatically.'
        },
      ]
    }
  },
];

function ContentRenderer({ body }) {
  return (
    <div>
      {body.map((block, i) => (
        <div key={i} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 4, height: 18, background: '#1e40af', borderRadius: 2, display: 'inline-block' }} />
            {block.heading}
          </h3>
          {block.text && <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.8, margin: 0 }}>{block.text}</p>}
          {block.bullets && (
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {block.bullets.map((b, j) => (
                <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', color: '#475569', fontSize: 14, borderBottom: '1px solid #f8fafc' }}>
                  <CheckCircle size={15} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                  {b}
                </li>
              ))}
            </ul>
          )}
          {block.steps && (
            <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {block.steps.map((s, j) => (
                <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1e40af', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{j + 1}</div>
                  <span style={{ color: '#475569', fontSize: 14, paddingTop: 3 }}>{s}</span>
                </li>
              ))}
            </ol>
          )}
          {block.table && (
            <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    {block.table.headers.map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.table.rows.map((row, ri) => (
                    <tr key={ri} style={{ borderTop: '1px solid #f1f5f9', background: ri % 2 === 0 ? '#fff' : '#fafafa' }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{ padding: '9px 14px', color: ci === 0 ? '#1e293b' : '#475569', fontWeight: ci === 0 ? 600 : 400 }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Docs() {
  const [active, setActive] = useState('overview');
  const [search, setSearch] = useState('');
  const current = sections.find(s => s.id === active);

  const filtered = search
    ? sections.filter(s => s.label.toLowerCase().includes(search.toLowerCase()) || s.content.title.toLowerCase().includes(search.toLowerCase()))
    : sections;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1e293b' }}>Documentation</h1>
        <p style={{ color: '#64748b', marginTop: 2 }}>Complete guide to ProBiz ERP — how every module works</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>

        {/* Sidebar nav */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', position: 'sticky', top: 80 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                placeholder="Search docs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 10px 8px 30px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </div>
          <nav style={{ padding: '8px 8px' }}>
            {filtered.map(({ id, icon: Icon, label, color }) => (
              <button key={id} onClick={() => { setActive(id); setSearch(''); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: active === id ? '#dbeafe' : 'transparent',
                  color: active === id ? '#1e40af' : '#475569',
                  fontWeight: active === id ? 700 : 400, fontSize: 13,
                  textAlign: 'left', marginBottom: 2,
                }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: active === id ? '#bfdbfe' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={14} color={active === id ? '#1e40af' : color} />
                </div>
                {label}
                {active === id && <ChevronRight size={13} style={{ marginLeft: 'auto' }} />}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 32 }}>
          {current ? (
            <>
              <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <current.icon size={22} color="#1e40af" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', margin: 0 }}>{current.content.title}</h2>
                    <p style={{ color: '#64748b', fontSize: 14, margin: 0, marginTop: 2 }}>{current.content.subtitle}</p>
                  </div>
                </div>
              </div>
              <ContentRenderer body={current.content.body} />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
              <BookOpen size={40} style={{ marginBottom: 12 }} />
              <p>No results found for "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
