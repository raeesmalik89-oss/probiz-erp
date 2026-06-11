import React, { useState } from 'react';
import {
  BookOpen, LayoutDashboard, Package, ShoppingCart, Truck, Users,
  Building2, UserCheck, BarChart3, Settings, Shield, ChevronRight,
  Zap, Lock, RefreshCw, Globe, AlertTriangle,
  CheckCircle, FileText, DollarSign, Clock, Hash, Search,
  TrendingUp, Layers, Crown, Play, Star, Phone
} from 'lucide-react';

const sections = [
  // ─── GETTING STARTED ───────────────────────────────────────────────────────
  {
    id: 'start', icon: Play, label: 'Getting Started', color: '#10b981',
    content: {
      title: 'Getting Started with ProBiz ERP',
      subtitle: 'Set up your system in under 30 minutes — follow these steps in order.',
      body: [
        {
          heading: 'Step 1 — Log In',
          steps: [
            'Open https://probiz-erp-poru.vercel.app in your browser',
            'Enter your email and password',
            'You will land on the Dashboard',
            'Bookmark the URL so you can access it from any device',
          ]
        },
        {
          heading: 'Step 2 — Set Up Your Company',
          steps: [
            'Go to Settings from the sidebar',
            'Update Company Name, Address, Phone, and Email',
            'This information prints on all invoices',
            'Click "Save All Settings"',
          ]
        },
        {
          heading: 'Step 3 — Add Your Products',
          steps: [
            'Go to Inventory → click "Add Product"',
            'Enter Product Name, Category, Unit (strips/pcs/kg), Cost Price, Sale Price',
            'Enter opening stock quantity',
            'For medicines: add Batch No., Mfg. Date, Expiry Date',
            'Repeat for all your products',
          ]
        },
        {
          heading: 'Step 4 — Add Customers & Suppliers',
          steps: [
            'Go to Customers → add your regular customers with credit limits',
            'Go to Suppliers → add your medicine/product suppliers',
            'Walk-in customers do not need to be added — use "Walk-in Customer" in POS',
          ]
        },
        {
          heading: 'Step 5 — Start Making Sales',
          steps: [
            'Go to Sales / POS → click "New Sale"',
            'Select customer, add products, enter quantities',
            'Select payment method (Cash / Credit)',
            'Click "Complete Sale" — invoice is generated instantly',
            'Click the print icon to print the invoice',
          ]
        },
        {
          heading: 'Quick Reference — Login Credentials',
          table: {
            headers: ['Role', 'Email', 'Password', 'Access Level'],
            rows: [
              ['Superadmin', 'raees.malik89@gmail.com', 'admin123', 'Full access — all modules'],
              ['Admin', 'admin@probiz.pk', 'admin123', 'All modules except system settings'],
              ['Manager', 'manager@probiz.pk', 'manager123', 'Inventory, Sales, Purchases, Reports'],
              ['Cashier', 'cashier@probiz.pk', 'cashier123', 'Sales / POS only'],
              ['Accountant', 'accountant@probiz.pk', 'acc123', 'Accounting and financial reports'],
            ]
          }
        },
        {
          heading: 'Important Tips for First Use',
          bullets: [
            'Change your password immediately — go to Settings → Change Password',
            'Reset demo data before entering real data — Settings → Reset to Clean Demo',
            'Add product categories first (Medicines, Surgical, Vitamins etc.) then add products',
            'Set minimum stock levels on every product so low-stock alerts work correctly',
            'Use Chrome or Edge browser for the best experience',
          ]
        }
      ]
    }
  },

  // ─── SYSTEM OVERVIEW ───────────────────────────────────────────────────────
  {
    id: 'overview', icon: Zap, label: 'System Overview', color: '#1e40af',
    content: {
      title: 'ProBiz ERP — System Overview',
      subtitle: 'A complete cloud-based Enterprise Resource Planning system built for Pakistani businesses.',
      body: [
        {
          heading: 'What is ProBiz ERP?',
          text: 'ProBiz ERP is an all-in-one business management platform that connects every part of your business — inventory, sales, purchasing, accounting, HR and payroll — into a single real-time system. Instead of running separate software for each department, everything talks to each other automatically. Built specifically for Pakistani pharmacies, hospitals, cash & carry stores, and wholesale businesses.'
        },
        {
          heading: 'Key Capabilities',
          bullets: [
            'Pharmacy-ready — Batch No., Mfg. Date, Expiry Date on every product and invoice',
            'Double-entry accounting engine — every transaction auto-posts to correct ledger accounts',
            'Real-time inventory — stock levels update instantly on every sale or purchase',
            'Multi-branch architecture — run Islamabad, Lahore, Karachi branches from one dashboard',
            'Role-based access control — 5 roles with different permissions',
            'JWT authentication — secure access tokens + refresh tokens',
            'Cloud-hosted — access from any browser, any device, anywhere in Pakistan',
            'Professional invoice printing with Pharmacist, Manager & Customer signature lines',
            'SaaS subscription system — trial, basic, professional, enterprise plans',
            'Profit tracking — cost vs sale price margin calculated per product and per invoice',
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
              ['Backend Host', 'PythonAnywhere', 'Python API server, always online'],
              ['Frontend Host', 'Vercel', 'Global CDN, instant deploy'],
            ]
          }
        },
        {
          heading: 'How Modules Connect',
          bullets: [
            'Sale completed → stock decreases → accounting journal entry created → dashboard updates',
            'Purchase received → stock increases → supplier payable increases → accounting entry created',
            'Payroll processed → employee salary expense recorded in accounting automatically',
            'Credit sale → customer receivable balance increases → shows in receivables report',
            'Credit purchase → supplier payable balance increases → shows in payables report',
          ]
        }
      ]
    }
  },

  // ─── DASHBOARD ─────────────────────────────────────────────────────────────
  {
    id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#3b82f6',
    content: {
      title: 'Dashboard',
      subtitle: 'Real-time business overview — everything important at one glance.',
      body: [
        {
          heading: 'KPI Cards (Top Row)',
          table: {
            headers: ['Card', 'What it Shows'],
            rows: [
              ["Today's Sales", 'Total revenue from all completed sales today'],
              ['Month Revenue', 'Cumulative sales for the current calendar month'],
              ['Total Products', 'Number of products in inventory + low-stock alert count'],
              ['Customers', 'Total customer accounts with total outstanding receivables (Rs.)'],
              ['Suppliers', 'Total suppliers with total outstanding payables (Rs.)'],
              ['Employees', 'Number of active staff members'],
            ]
          }
        },
        {
          heading: 'Charts',
          bullets: [
            'Sales — Last 7 Days: Area chart showing daily sales trend for the past week',
            'Top Products: Pie chart of best-selling products by revenue this month',
            'Sales vs Purchases (6 Months): Bar chart comparing monthly totals side by side',
            'Recent Sales: Live table of the latest invoices with customer, amount and status',
          ]
        },
        {
          heading: 'Low Stock Alerts',
          text: 'When any product falls below its minimum stock level, a yellow warning panel appears at the bottom of the dashboard showing the product name, current stock, and minimum threshold. Click on a product to go directly to its edit form and update the stock or reorder.'
        },
        {
          heading: 'Data Refresh',
          text: 'Dashboard data loads fresh every time you open it. To see the very latest numbers after making a sale, click the Dashboard link in the sidebar again to force a reload.'
        }
      ]
    }
  },

  // ─── INVENTORY ─────────────────────────────────────────────────────────────
  {
    id: 'inventory', icon: Package, label: 'Inventory', color: '#10b981',
    content: {
      title: 'Inventory Management',
      subtitle: 'Track every product, category, batch number and stock movement in real time.',
      body: [
        {
          heading: 'Adding a Product',
          steps: [
            'Go to Inventory from the sidebar',
            'Click the "Add Product" button (top right)',
            'Fill in Name, SKU (unique code), Category, Unit, Cost Price, Sale Price',
            'Enter Opening Stock and Minimum Stock (alert threshold)',
            'For medicines/pharmacy: fill in Batch No., Mfg. Date, Expiry Date',
            'Click Save — the product is immediately available in POS',
          ]
        },
        {
          heading: 'Product Fields Explained',
          table: {
            headers: ['Field', 'Description', 'Example'],
            rows: [
              ['Name', 'Full product name', 'Panadol 500mg'],
              ['SKU', 'Unique product code for quick lookup', 'MED-001'],
              ['Barcode', 'Product barcode (optional, must be unique)', '6281234567890'],
              ['Category', 'Product group for filtering and reports', 'Medicines'],
              ['Unit', 'How the product is measured or sold', 'strips, pcs, kg, box'],
              ['Cost Price', 'What you paid the supplier (Rs.)', 'Rs. 80'],
              ['Sale Price', 'What you charge the customer (Rs.)', 'Rs. 100'],
              ['Stock', 'Current quantity in stock', '50'],
              ['Min Stock', 'Alert threshold — warns when stock drops below this', '10'],
              ['Batch No.', 'Manufacturer batch/lot number for traceability', 'B-2024-P01'],
              ['Mfg. Date', 'Manufacturing date', '2024-01-15'],
              ['Expiry Date', 'Expiry date — shown in red on invoices if set', '2026-06-01'],
            ]
          }
        },
        {
          heading: 'Batch & Expiry Tracking (Pharmacy)',
          bullets: [
            'Every product can have a Batch No., Mfg. Date, and Expiry Date',
            'These appear on printed invoices for full traceability',
            'Expiry dates are shown in red bold on invoices as a visual alert',
            'Helps with medicine recalls — you can find which customers received a specific batch',
            'Keeps you compliant with DRAP (Drug Regulatory Authority Pakistan) requirements',
          ]
        },
        {
          heading: 'How Stock Updates Automatically',
          bullets: [
            'Sale completed → stock decreases by sold quantity instantly',
            'Purchase received → stock increases by received quantity instantly',
            'No manual stock adjustment needed for normal buy/sell operations',
            'Low stock alert fires on dashboard when current stock < minimum stock',
          ]
        },
        {
          heading: 'Categories',
          text: 'Organize products into categories (Medicines, Surgical, Cosmetics, Vitamins, Baby Care etc.). Filter the product list by category for faster searching. Reports show revenue breakdown by category so you know which lines are most profitable.'
        },
        {
          heading: 'Searching Products',
          text: 'Use the search bar at the top of the Inventory page. You can search by product name, SKU, or barcode. Results appear instantly as you type — no need to press Enter.'
        }
      ]
    }
  },

  // ─── SALES / POS ───────────────────────────────────────────────────────────
  {
    id: 'sales', icon: ShoppingCart, label: 'Sales / POS', color: '#f59e0b',
    content: {
      title: 'Sales & Point of Sale (POS)',
      subtitle: 'Process sales, generate invoices, track payments and print professional receipts.',
      body: [
        {
          heading: 'Creating a Sale',
          steps: [
            'Go to Sales / POS from the sidebar',
            'Click "New Sale"',
            'Select customer (or use "Walk-in Customer" for cash sales)',
            'Search for products and enter quantity for each item',
            'Apply discount if any (enter discount amount)',
            'Select payment method: Cash, Card, Bank Transfer, or Credit',
            'Click "Complete Sale" — invoice is generated instantly',
          ]
        },
        {
          heading: 'Invoice Numbering',
          text: 'Every invoice gets a unique number: INV-YYYYMM-NNNNN (e.g. INV-202606-00001). Numbers are sequential, never repeat and never have gaps — required for proper accounting records.'
        },
        {
          heading: 'Payment Methods',
          table: {
            headers: ['Method', 'How it works', 'Balance after sale'],
            rows: [
              ['Cash', 'Full payment received in cash immediately', 'Rs. 0 — fully paid'],
              ['Card', 'Payment by debit or credit card', 'Rs. 0 — fully paid'],
              ['Bank Transfer', 'Payment via online bank transfer', 'Rs. 0 — fully paid'],
              ['Credit', 'Sale on credit — added to customer receivables', 'Full amount outstanding until paid'],
            ]
          }
        },
        {
          heading: 'Invoice Printing — Pharmacy Format',
          bullets: [
            'Click the print icon (🖨️) on any completed invoice',
            'Invoice shows: Business name, address, phone, invoice number, date',
            'Product table includes: Name, Batch No., Mfg. Date, Expiry Date, Qty, Price, Total',
            'Expiry dates shown in red bold as a safety alert',
            'Three signature lines at the bottom: Pharmacist / Licensed Pharmacist, Manager / Authorized Signatory, Customer / Received By',
            'Print-optimized layout — sidebar and headers are hidden automatically',
          ]
        },
        {
          heading: 'Sales on Credit',
          text: "When you select Credit as payment method, the sale is recorded but the full amount is added to the customer's outstanding balance. The system checks the customer's credit limit — if exceeded, a warning is shown. You can record payments against credit invoices from the customer's profile."
        },
        {
          heading: 'What Happens Automatically',
          bullets: [
            'Stock of each sold product decreases immediately',
            'Invoice saved with all line items, prices, discounts and totals',
            'Credit sale: customer receivable balance increases',
            'Profit margin calculated: (sale price − cost price) × quantity',
            'Accounting journal entry created automatically',
            'Dashboard charts and KPIs update in real time',
          ]
        }
      ]
    }
  },

  // ─── PURCHASES ─────────────────────────────────────────────────────────────
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
            'Select the supplier',
            'Add products and quantities being ordered/received',
            'Enter cost prices for this purchase',
            'Select payment method: Cash (paid now) or Credit (payable later)',
            'Add notes if needed (e.g. invoice number from supplier)',
            'Save the purchase',
          ]
        },
        {
          heading: 'What Happens When Purchase is Saved',
          bullets: [
            'Stock of each purchased product increases immediately',
            'Credit purchase: supplier payable balance increases',
            'Purchase order gets a unique PO number (PO-YYYYMM-NNNNN)',
            'Accounting journal entry created automatically (Inventory Dr / Cash or Payable Cr)',
          ]
        },
        {
          heading: 'Payables Tracking',
          text: 'All credit purchases are tracked as Accounts Payable. You can see the total amount owed to each supplier on the Suppliers page. When you pay a supplier, record the payment to reduce the payable balance and create the correct journal entry.'
        },
        {
          heading: 'Purchase History',
          text: 'All purchase orders are listed with date, supplier, amount, payment status, and items received. Filter by date range or supplier to find any historical purchase.'
        }
      ]
    }
  },

  // ─── CUSTOMERS ─────────────────────────────────────────────────────────────
  {
    id: 'customers', icon: Users, label: 'Customers', color: '#ef4444',
    content: {
      title: 'Customer Management',
      subtitle: 'Maintain customer accounts, credit limits, outstanding balances and purchase history.',
      body: [
        {
          heading: 'Customer Fields',
          table: {
            headers: ['Field', 'Description', 'Example'],
            rows: [
              ['Name', 'Full name of customer or business', 'Ahmad Medical Store'],
              ['Phone', 'Contact number', '0321-1234567'],
              ['Email', 'Email address (optional)', 'ahmad@gmail.com'],
              ['City', 'City for delivery and records', 'Islamabad'],
              ['Credit Limit', 'Maximum credit allowed (Rs.). Set 0 for no credit.', 'Rs. 50,000'],
              ['Balance', 'Current outstanding amount owed — auto-calculated', 'Rs. 12,500'],
            ]
          }
        },
        {
          heading: 'Credit Management',
          bullets: [
            'Each customer has a credit limit you set when adding them',
            'When a credit sale is made, their outstanding balance increases',
            'When they make a payment, the balance decreases',
            'If a new credit sale would exceed their limit, a warning is shown',
            'You can still override and allow the sale if needed',
            'Receivables report shows all customers with outstanding balances',
          ]
        },
        {
          heading: 'Customer Purchase History',
          text: 'Every invoice linked to a customer is visible in their record. You can see total purchases, total paid, and outstanding balance at any time. This is useful when a customer disputes a balance — you can show them exactly which invoices are unpaid.'
        },
        {
          heading: 'Walk-in Customers',
          text: 'For cash sales to customers you do not track, simply select "Walk-in Customer" in the POS. No customer account is needed. The sale is recorded as a cash transaction with no receivable.'
        }
      ]
    }
  },

  // ─── SUPPLIERS ─────────────────────────────────────────────────────────────
  {
    id: 'suppliers', icon: Building2, label: 'Suppliers', color: '#0ea5e9',
    content: {
      title: 'Supplier Management',
      subtitle: 'Track all your suppliers, purchase history and outstanding payables.',
      body: [
        {
          heading: 'Supplier Fields',
          table: {
            headers: ['Field', 'Description'],
            rows: [
              ['Company Name', 'Supplier / distributor business name'],
              ['Contact Person', 'Main contact at the supplier'],
              ['Phone / Email', 'Contact details for ordering and queries'],
              ['City', 'Supplier location'],
              ['Balance', 'Amount currently owed to this supplier (auto-calculated)'],
              ['Notes', 'Any additional info — payment terms, minimum order etc.'],
            ]
          }
        },
        {
          heading: 'Payables Management',
          text: 'Every credit purchase from a supplier increases their payable balance. When you pay the supplier, record the payment in the system to reduce the balance. The Suppliers list shows total payable at a glance so you always know who to pay and how much.'
        },
        {
          heading: 'Supplier Purchase History',
          text: 'View all purchases made from a supplier — dates, amounts, what was ordered, and payment status. Useful for checking delivery frequency, negotiating better prices, or resolving disputes.'
        }
      ]
    }
  },

  // ─── ACCOUNTING ────────────────────────────────────────────────────────────
  {
    id: 'accounting', icon: BookOpen, label: 'Accounting', color: '#f97316',
    content: {
      title: 'Accounting Module',
      subtitle: 'Double-entry bookkeeping, chart of accounts, journal entries and financial statements.',
      body: [
        {
          heading: 'What is Double-Entry Accounting?',
          text: 'Every financial transaction affects two accounts — one is debited and one is credited for the same amount. This ensures the books always balance (Assets = Liabilities + Equity). ProBiz automatically creates the correct journal entries for every sale, purchase and payment — you do not need to do this manually.'
        },
        {
          heading: 'Account Types',
          table: {
            headers: ['Type', 'Examples', 'Normal Balance'],
            rows: [
              ['Asset', 'Cash, Bank, Inventory, Accounts Receivable', 'Debit'],
              ['Liability', 'Accounts Payable, Loans Payable', 'Credit'],
              ['Equity', "Owner's Equity, Retained Earnings", 'Credit'],
              ['Income', 'Sales Revenue, Other Income', 'Credit'],
              ['Expense', 'Cost of Goods Sold, Salaries, Rent, Utilities', 'Debit'],
            ]
          }
        },
        {
          heading: 'Automatic Journal Entries',
          table: {
            headers: ['Transaction', 'Debit', 'Credit'],
            rows: [
              ['Cash Sale Rs. 1,000', 'Cash Rs. 1,000', 'Sales Revenue Rs. 1,000'],
              ['Credit Sale Rs. 1,000', 'Accounts Receivable Rs. 1,000', 'Sales Revenue Rs. 1,000'],
              ['Cash Purchase Rs. 500', 'Inventory Rs. 500', 'Cash Rs. 500'],
              ['Credit Purchase Rs. 500', 'Inventory Rs. 500', 'Accounts Payable Rs. 500'],
              ['Customer Payment Rs. 1,000', 'Cash Rs. 1,000', 'Accounts Receivable Rs. 1,000'],
              ['Supplier Payment Rs. 500', 'Accounts Payable Rs. 500', 'Cash Rs. 500'],
            ]
          }
        },
        {
          heading: 'Manual Journal Entries',
          text: 'For adjustments, depreciation, owner drawings or any non-standard transactions, you can create manual journal entries. Go to Accounting → Journal Entries → New Entry. Select debit account, credit account, amount, and description.'
        },
        {
          heading: 'Financial Reports Available',
          bullets: [
            'Trial Balance — all account balances side by side to verify books are balanced',
            'Profit & Loss Statement — total income minus total expenses for any period',
            'Balance Sheet — snapshot of all assets, liabilities and equity at any date',
            'General Ledger — full transaction history for any single account',
            'Accounts Receivable Aging — who owes you money and for how long',
            'Accounts Payable Aging — who you owe money to and for how long',
          ]
        }
      ]
    }
  },

  // ─── PAYROLL ───────────────────────────────────────────────────────────────
  {
    id: 'payroll', icon: UserCheck, label: 'HR & Payroll', color: '#6366f1',
    content: {
      title: 'HR & Payroll Module',
      subtitle: 'Employee management, attendance tracking and automated payslip generation.',
      body: [
        {
          heading: 'Setting Up an Employee',
          steps: [
            'Go to HR & Payroll from the sidebar',
            'Click "Add Employee"',
            'Enter: Full Name, Employee ID, Department, Designation, Phone, CNIC',
            'Set Basic Salary, Allowances (house rent, medical, transport), Deductions (EOBI, tax)',
            'Assign to a branch',
            'Set Join Date and mark as Active',
            'Save',
          ]
        },
        {
          heading: 'Salary Structure',
          table: {
            headers: ['Component', 'Description', 'Example'],
            rows: [
              ['Basic Salary', 'Fixed monthly base pay agreed with employee', 'Rs. 25,000'],
              ['Allowances', 'House rent, transport, medical, other benefits', 'Rs. 8,000'],
              ['Deductions', 'EOBI contribution, income tax, loan repayment', 'Rs. 1,200'],
              ['Net Salary', 'Basic + Allowances − Deductions = amount to pay', 'Rs. 31,800'],
            ]
          }
        },
        {
          heading: 'Processing Monthly Payroll',
          steps: [
            'Go to HR & Payroll → click "Process Payroll"',
            'Select the month and year',
            'System calculates net salary for every active employee automatically',
            'Review the payroll summary — make adjustments if needed',
            'Confirm and generate — payslips are created for all employees',
            'Print payslips for each employee',
          ]
        },
        {
          heading: 'Attendance Tracking',
          text: 'Mark daily attendance for each employee: Present, Absent, Half Day, or Leave. Attendance records are stored per employee per day. Absent days can be used to calculate salary deductions for the month based on your company policy.'
        },
        {
          heading: 'Departments',
          text: 'Organize employees into departments (Pharmacy, Management, Accounts, Delivery etc.). Each department can be linked to a branch. Department-level payroll reports show total salary cost per department.'
        }
      ]
    }
  },

  // ─── REPORTS ───────────────────────────────────────────────────────────────
  {
    id: 'reports', icon: BarChart3, label: 'Reports', color: '#ec4899',
    content: {
      title: 'Reports & Analytics',
      subtitle: 'Every business metric you need — generated instantly for any date range.',
      body: [
        {
          heading: 'Available Reports',
          table: {
            headers: ['Report', 'What it Shows', 'Key Filters'],
            rows: [
              ['Sales Report', 'All invoices with customer, items, amounts, status', 'Date range, customer, payment method'],
              ['Purchase Report', 'All purchase orders with supplier, items, amounts', 'Date range, supplier'],
              ['Inventory Report', 'Current stock levels, value, low stock warnings', 'Category, low stock filter'],
              ['Profit & Loss', 'Revenue minus costs = gross and net profit', 'Date range (month / year)'],
              ['Balance Sheet', 'Assets, liabilities and equity snapshot', 'As of any date'],
              ['Summary Report', 'Total sales, purchases, profit overview in one view', 'Date range'],
              ['Receivables', 'Customers with outstanding balances and aging', 'Overdue filter'],
              ['Payables', 'Suppliers with outstanding payables and aging', 'Overdue filter'],
              ['Payroll Report', 'Monthly salary summary per employee', 'Month / year'],
              ['Top Products', 'Best selling products by quantity and revenue', 'Date range'],
            ]
          }
        },
        {
          heading: 'Profit & Loss Statement',
          bullets: [
            'Total Revenue — sum of all sales for the period',
            'Cost of Goods Sold — total cost price of all items sold',
            'Gross Profit — Revenue minus Cost of Goods Sold',
            'Operating Expenses — salaries, rent, utilities etc.',
            'Net Profit — Gross Profit minus Operating Expenses',
            'Print as PDF — optimized print layout with full page formatting',
          ]
        },
        {
          heading: 'Summary Report',
          text: 'The Summary Report gives you a complete business snapshot: total sales amount, total purchases, total profit, number of invoices, top customers, and top products — all in one screen with date range filtering. Ideal for daily or weekly review meetings.'
        },
        {
          heading: 'Printing Reports',
          text: 'Every report has a Print button. The print layout hides the sidebar and navigation for a clean output. Use your browser\'s Print function (Ctrl+P) to save as PDF or print to paper. Reports are formatted to fit on A4 pages.'
        }
      ]
    }
  },

  // ─── SUBSCRIPTION ──────────────────────────────────────────────────────────
  {
    id: 'subscription', icon: Crown, label: 'Subscription & Plans', color: '#f59e0b',
    content: {
      title: 'Subscription & Plans',
      subtitle: 'Free trial, plan activation, and how the billing system works.',
      body: [
        {
          heading: 'Free Trial',
          text: 'Every new ProBiz installation starts with a 14-day free trial. You get full access to all features — no credit card required, no limitations. The trial banner at the top of the screen shows how many days remain. When the trial ends, the system shows a paywall — you need to activate a paid plan to continue.'
        },
        {
          heading: 'Available Plans',
          table: {
            headers: ['Plan', 'Price', 'Branches', 'Users', 'Best For'],
            rows: [
              ['Free Trial', 'Free / 14 days', '1', '3', 'Evaluation and testing'],
              ['Basic', 'Rs. 2,500/month', '1', '3', 'Single pharmacy or small shop'],
              ['Professional', 'Rs. 5,000/month', '3', '10', 'Clinic + pharmacy, small chain'],
              ['Enterprise', 'Rs. 15,000/month', 'Unlimited', 'Unlimited', 'Hospital, large wholesale, chain stores'],
            ]
          }
        },
        {
          heading: 'How to Activate a Plan',
          steps: [
            'Contact us: WhatsApp 0316-8818693 or raees.malik89@gmail.com',
            'Tell us which plan you want and for how many months',
            'Make payment via JazzCash / EasyPaisa / Bank Transfer',
            'Send payment screenshot on WhatsApp',
            'We activate your plan within minutes — system unlocks immediately',
          ]
        },
        {
          heading: 'For System Administrators (Superadmin)',
          bullets: [
            'Go to Settings → Subscription Management to see the current plan status',
            'Dashboard shows: plan name, days remaining, expiry date, max users',
            'Activate Paid Plan: select plan and months → click Activate',
            'Extend Free Trial: add 3, 7, 14, or 30 extra days for evaluation',
            'Demo Requests: see all leads from the landing page, mark as contacted or activated',
          ]
        },
        {
          heading: 'What Happens When Trial Expires',
          bullets: [
            'A full-screen paywall appears with the 3 plan options',
            'Users cannot access any module until a plan is activated',
            'All data is preserved — nothing is deleted when trial expires',
            'Superadmin can still log in and activate a plan from Settings',
            'After activation, the paywall disappears and full access is restored instantly',
          ]
        }
      ]
    }
  },

  // ─── SETTINGS ──────────────────────────────────────────────────────────────
  {
    id: 'settings', icon: Settings, label: 'Settings', color: '#64748b',
    content: {
      title: 'Settings',
      subtitle: 'Company configuration, user management, password change and system tools.',
      body: [
        {
          heading: 'Company Information',
          text: 'Update your business name, address, phone number and email. This information is printed on every invoice and purchase order, so make sure it is accurate before making your first sale.'
        },
        {
          heading: 'Change Password',
          steps: [
            'Go to Settings from the sidebar',
            'Scroll to the "Change Password" section',
            'Enter your Current Password',
            'Enter New Password (minimum 6 characters)',
            'Confirm New Password (must match)',
            'Click "Change Password"',
            'A success message confirms the change — use the new password next time you log in',
          ]
        },
        {
          heading: 'Financial Settings',
          bullets: [
            'Default Tax Rate (%) — applied to invoices if GST is applicable',
            'Fiscal Year Start — choose January, July, or April based on your business year',
            'Invoice Prefix — customize invoice numbering prefix (default: INV-)',
            'PO Prefix — customize purchase order prefix (default: PO-)',
          ]
        },
        {
          heading: 'Notifications',
          bullets: [
            'Low stock alerts — get notified when products fall below minimum stock',
            'New sale notifications — alert for each new sale',
            'Payroll reminders — reminder when payroll is due',
          ]
        },
        {
          heading: 'Reset to Demo Data',
          text: '⚠️ WARNING: This wipes ALL current data (sales, inventory, customers, purchases, employees, accounting records) and replaces it with a small demo dataset. Use this ONLY when setting up a fresh installation or for testing. Your admin login is preserved. This action cannot be undone.'
        },
        {
          heading: 'Role Permissions Reference',
          table: {
            headers: ['Permission', 'Superadmin', 'Admin', 'Manager', 'Cashier', 'Accountant'],
            rows: [
              ['View Dashboard', '✅', '✅', '✅', '✅', '✅'],
              ['Manage Inventory', '✅', '✅', '✅', '❌', '❌'],
              ['Process Sales', '✅', '✅', '✅', '✅', '❌'],
              ['Manage Purchases', '✅', '✅', '✅', '❌', '❌'],
              ['View Accounting', '✅', '✅', '❌', '❌', '✅'],
              ['Manage Payroll', '✅', '✅', '❌', '❌', '❌'],
              ['System Settings', '✅', '❌', '❌', '❌', '❌'],
            ]
          }
        }
      ]
    }
  },

  // ─── SECURITY ──────────────────────────────────────────────────────────────
  {
    id: 'security', icon: Shield, label: 'Security & Roles', color: '#dc2626',
    content: {
      title: 'Security & Role-Based Access',
      subtitle: 'Five roles with carefully designed permissions so each user sees only what they need.',
      body: [
        {
          heading: 'User Roles',
          table: {
            headers: ['Role', 'Who it is for', 'Key Permissions'],
            rows: [
              ['Superadmin', 'Business owner / IT admin', 'Full access — all modules, settings, reset, user management, subscriptions'],
              ['Admin', 'General manager', 'All modules except system reset and subscription management'],
              ['Manager', 'Branch manager', 'Inventory, sales, purchases, HR, reports — no accounting settings'],
              ['Cashier', 'Sales counter staff', 'Create sales and view own invoices only'],
              ['Accountant', 'Finance staff', 'Accounting module, journal entries, financial reports'],
            ]
          }
        },
        {
          heading: 'Authentication System',
          bullets: [
            'JWT (JSON Web Token) authentication — industry standard for web security',
            'Access token expires after 1 hour — forces re-login for abandoned sessions',
            'Refresh token silently refreshes the session without requiring password re-entry',
            'Passwords hashed with bcrypt — never stored in plain text, never readable',
            'All API endpoints require a valid Bearer token — direct URL access is blocked',
          ]
        },
        {
          heading: 'API Security',
          text: 'Role checks are enforced server-side (on the backend). Even if someone bypasses the frontend UI, they cannot call restricted endpoints without the correct role token. CORS is configured to only allow requests from your specific Vercel frontend domain.'
        },
        {
          heading: 'Best Practices',
          bullets: [
            'Change the default admin password immediately after setup',
            'Use strong passwords (8+ characters, mix of letters, numbers, symbols)',
            'Do not share your superadmin login — create separate accounts for each staff member',
            'Assign the lowest role needed — cashiers do not need admin access',
            'Log out when leaving your computer unattended',
          ]
        }
      ]
    }
  },

  // ─── MULTI-BRANCH ──────────────────────────────────────────────────────────
  {
    id: 'multibranch', icon: Layers, label: 'Multi-Branch', color: '#14b8a6',
    content: {
      title: 'Multi-Branch Management',
      subtitle: 'Run multiple business locations — pharmacies, branches, warehouses — from one account.',
      body: [
        {
          heading: 'How Multi-Branch Works',
          text: 'Every record in ProBiz (products, sales, purchases, employees) is linked to a branch. Superadmin can see consolidated data from all branches in reports. Branch managers and cashiers only see data for their own branch — they cannot access another branch\'s data.'
        },
        {
          heading: 'What is Tracked Per Branch',
          bullets: [
            'Inventory stock levels — each branch maintains its own stock',
            'Sales and revenue — daily and monthly totals per branch',
            'Purchases — each branch orders from suppliers independently',
            'Employees — staff are assigned to specific branches',
            'Payroll — processed per branch or consolidated for all',
          ]
        },
        {
          heading: 'Setting Up a New Branch',
          steps: [
            'Go to Settings → Branches (superadmin only)',
            'Add branch with name, city, address, and phone',
            'Create user accounts assigned to the new branch',
            'Add products with opening stock for the new branch',
            'Assign a manager to the branch',
          ]
        },
        {
          heading: 'Consolidated Reporting',
          text: 'As superadmin, Reports show data from all branches combined. You can also filter any report by branch to see one location at a time. This lets you compare performance between branches and identify which location is most profitable.'
        }
      ]
    }
  },

  // ─── FAQ ───────────────────────────────────────────────────────────────────
  {
    id: 'faq', icon: Hash, label: 'FAQ', color: '#a855f7',
    content: {
      title: 'Frequently Asked Questions',
      subtitle: 'Common questions about using ProBiz ERP.',
      body: [
        {
          heading: 'Can I use ProBiz on my mobile phone?',
          text: 'Yes. ProBiz ERP is a web application accessible from any browser including Chrome on Android and Safari on iPhone. The layout works on both desktop and mobile, though desktop gives the best experience for data entry and reports.'
        },
        {
          heading: 'What happens to my data if I close the browser?',
          text: 'All data is saved to the cloud database instantly when you click Save or Complete Sale. Closing the browser has no effect — your data is always there when you log back in from any device.'
        },
        {
          heading: 'Can multiple staff log in at the same time?',
          text: 'Yes. ProBiz supports concurrent users. A cashier can be making sales while the accountant runs reports and the manager checks inventory — all simultaneously with no conflicts.'
        },
        {
          heading: 'How do I add my real products and remove demo data?',
          text: 'Go to Settings → "Reset to Clean Demo" → confirm. This wipes all demo records and gives you a clean system. Then add your real products via Inventory → Add Product. Contact us if you need bulk import from an Excel file.'
        },
        {
          heading: 'Why is the barcode field not accepting my input?',
          text: 'Barcode must be unique across all products. If you see an error, the barcode is already used by another product. Leave the barcode field empty if you do not use barcodes — the system works perfectly without them.'
        },
        {
          heading: 'How do I print an invoice?',
          text: 'Open the sale record and click the print icon (🖨️). A print-optimized view opens automatically. Press Ctrl+P (Windows) or Cmd+P (Mac) to print or save as PDF. The invoice includes product details, batch numbers, expiry dates, and three signature lines.'
        },
        {
          heading: 'What is the difference between Cost Price and Sale Price?',
          text: 'Cost Price is what you paid the supplier. Sale Price is what you charge the customer. The difference (Sale Price − Cost Price) × Quantity = your profit on that item. ProBiz tracks both so it calculates real profit per sale automatically.'
        },
        {
          heading: 'How do I record a payment from a customer?',
          text: 'Go to Customers → find the customer → click on their record → record payment. Enter the amount received, date, and payment method (cash/bank). This reduces their outstanding balance and creates the correct accounting entry.'
        },
        {
          heading: 'Can I give a discount on a sale?',
          text: 'Yes. When creating a sale in POS, there is a discount field. Enter the discount amount and it is deducted from the total before recording the sale.'
        },
        {
          heading: 'How do I change my password?',
          text: 'Go to Settings → scroll to "Change Password" section → enter current password → enter new password twice → click Change Password. The new password takes effect immediately.'
        },
        {
          heading: 'What happens when my trial expires?',
          text: 'A paywall screen appears. All your data is preserved — nothing is deleted. Contact us on 0316-8818693 or WhatsApp to activate a paid plan. Your account is unlocked within minutes after payment confirmation.'
        },
        {
          heading: 'Is my data backed up?',
          text: 'Data is stored on PythonAnywhere\'s cloud servers. For business-critical data, we recommend upgrading to a PostgreSQL database which includes automatic daily backups. Contact us to set this up.'
        },
        {
          heading: 'Can I export data to Excel?',
          text: 'Currently, reports can be printed as PDF via the browser print function (Ctrl+P → Save as PDF). Full CSV/Excel export is on the roadmap for the next version. Contact us if you need a data export urgently — we can do it manually.'
        },
      ]
    }
  },

  // ─── CONTACT / SUPPORT ─────────────────────────────────────────────────────
  {
    id: 'support', icon: Phone, label: 'Contact & Support', color: '#16a34a',
    content: {
      title: 'Contact & Support',
      subtitle: 'Get help, request features, or upgrade your plan.',
      body: [
        {
          heading: 'Contact Information',
          table: {
            headers: ['Channel', 'Details', 'Best For'],
            rows: [
              ['WhatsApp', '0316-8818693', 'Fastest response — plan activation, urgent issues'],
              ['Phone', '0316-8818693', 'Direct call for complex questions'],
              ['Email', 'raees.malik89@gmail.com', 'Non-urgent queries, data export requests'],
              ['Office', 'House 124, Street 39, I-14/3, Islamabad', 'In-person training and setup'],
            ]
          }
        },
        {
          heading: 'Support Hours',
          bullets: [
            'Monday – Saturday: 9:00 AM – 9:00 PM (Pakistan Standard Time)',
            'Sunday: 10:00 AM – 6:00 PM',
            'Emergency support for active paid plans: WhatsApp any time',
          ]
        },
        {
          heading: 'What We Can Help With',
          bullets: [
            'Plan activation and upgrades',
            'Initial setup and data migration from Excel',
            'Staff training (in-person or via Zoom/WhatsApp video)',
            'Custom reports or features for your business',
            'Technical issues or bugs',
            'Bulk product import from your existing records',
            'Adding your business logo to invoices',
          ]
        },
        {
          heading: 'Requesting a Feature',
          text: 'ProBiz ERP is actively developed. If you need a specific feature (e.g. Urdu invoices, SMS notifications, online ordering integration), WhatsApp us with the details. New features are added regularly based on customer feedback.'
        },
        {
          heading: 'Reporting a Problem',
          steps: [
            'Take a screenshot of the error or unexpected behavior',
            'Note what you were doing when the problem occurred',
            'WhatsApp the screenshot to 0316-8818693',
            'Include your business name and the time of the problem',
            'Most issues are resolved within 2–4 hours during support hours',
          ]
        }
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
            <span style={{ width: 4, height: 18, background: '#1e40af', borderRadius: 2, display: 'inline-block', flexShrink: 0 }} />
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
  const [active, setActive] = useState('start');
  const [search, setSearch] = useState('');
  const current = sections.find(s => s.id === active);

  const filtered = search
    ? sections.filter(s =>
        s.label.toLowerCase().includes(search.toLowerCase()) ||
        s.content.title.toLowerCase().includes(search.toLowerCase()) ||
        s.content.body.some(b => b.heading?.toLowerCase().includes(search.toLowerCase()))
      )
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
          <nav style={{ padding: '8px 8px', maxHeight: '70vh', overflowY: 'auto' }}>
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

              {/* Next section navigation */}
              {(() => {
                const idx = sections.findIndex(s => s.id === active);
                const next = sections[idx + 1];
                if (!next) return null;
                return (
                  <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={() => setActive(next.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px',
                      background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10,
                      cursor: 'pointer', color: '#1e40af', fontWeight: 600, fontSize: 14,
                    }}>
                      Next: {next.label} →
                    </button>
                  </div>
                );
              })()}
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
