# ProBiz ERP — Advanced Business Management System

Pakistan's most advanced ERP system. Built with FastAPI + React.

## Quick Start

### Step 1 — Start Backend
Double-click `start-backend.bat` or run:
```
cd backend
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --port 8000
```

### Step 2 — Start Frontend
Double-click `start-frontend.bat` or run:
```
cd frontend
npm install
npm start
```

### Access
- **Marketing Website:** http://localhost:3000
- **ERP Login:** http://localhost:3000/login
- **API Docs:** http://localhost:8000/docs

## Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@probiz.pk | admin123 |
| Manager | manager@probiz.pk | manager123 |
| Cashier | cashier@probiz.pk | cashier123 |
| Accountant | accountant@probiz.pk | acc123 |

## Modules
- Dashboard (real-time KPIs + charts)
- Inventory (products, categories, stock alerts)
- Sales & POS (invoices, customers, payments)
- Purchases (purchase orders, suppliers)
- Customers & Suppliers management
- Accounting (chart of accounts, transactions, P&L)
- HR & Payroll (employees, attendance, payslips)
- Reports & Analytics (multi-chart views)
- Settings (company info, roles, notifications)

## Tech Stack
- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, SQLite
- **Frontend:** React 18, Recharts, Lucide Icons, React Router
- **Auth:** JWT tokens, bcrypt password hashing
- **DB:** SQLite (upgradeable to PostgreSQL)
