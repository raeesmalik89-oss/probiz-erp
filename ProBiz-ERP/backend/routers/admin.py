from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from auth import get_current_user, get_password_hash
from datetime import datetime

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.post("/reset-demo")
def reset_to_demo(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "superadmin":
        raise HTTPException(status_code=403, detail="Only superadmin can reset data")

    # ── Delete all transactional data ──────────────────────────────────────
    db.query(models.SaleItem).delete()
    db.query(models.Sale).delete()
    db.query(models.PurchaseItem).delete(synchronize_session=False)
    db.query(models.Purchase).delete(synchronize_session=False)
    db.query(models.Transaction).delete(synchronize_session=False)
    db.query(models.Payslip).delete(synchronize_session=False)
    db.query(models.Attendance).delete(synchronize_session=False)
    db.query(models.AuditLog).delete(synchronize_session=False)
    db.query(models.Notification).delete(synchronize_session=False)

    # ── Delete employees, departments, customers, suppliers, products, categories ──
    db.query(models.Employee).delete(synchronize_session=False)
    db.query(models.Department).delete(synchronize_session=False)
    db.query(models.Customer).delete(synchronize_session=False)
    db.query(models.Supplier).delete(synchronize_session=False)
    db.query(models.Product).delete(synchronize_session=False)
    db.query(models.Category).delete(synchronize_session=False)
    db.query(models.Account).delete(synchronize_session=False)

    # Delete extra branches (keep only main)
    db.query(models.Branch).filter(models.Branch.id != current_user.branch_id).delete(synchronize_session=False)

    # Delete extra users (keep only superadmin)
    db.query(models.User).filter(models.User.id != current_user.id).delete(synchronize_session=False)

    db.commit()
    db.flush()

    # ── Seed minimal demo data (2-3 records each) ──────────────────────────
    branch_id = current_user.branch_id or 1

    # 2 Categories
    cat1 = models.Category(name="Medicines", description="Pharmaceutical products")
    cat2 = models.Category(name="General", description="General merchandise")
    db.add_all([cat1, cat2])
    db.flush()

    # 3 Products (minimal demo)
    p1 = models.Product(name="Panadol 500mg", sku="MED001", category_id=cat1.id, branch_id=branch_id, unit="strips", cost_price=80, sale_price=100, stock=50, min_stock=10)
    p2 = models.Product(name="Augmentin 625mg", sku="MED002", category_id=cat1.id, branch_id=branch_id, unit="strips", cost_price=450, sale_price=520, stock=20, min_stock=10)
    p3 = models.Product(name="Dettol Antiseptic", sku="GEN001", category_id=cat2.id, branch_id=branch_id, unit="pcs", cost_price=120, sale_price=150, stock=30, min_stock=5)
    db.add_all([p1, p2, p3])
    db.flush()

    # 2 Customers
    c1 = models.Customer(name="Walk-in Customer", phone="0300-0000000")
    c2 = models.Customer(name="Sample Clinic", phone="051-1234567", city="Islamabad", credit_limit=50000)
    db.add_all([c1, c2])
    db.flush()

    # 2 Suppliers
    s1 = models.Supplier(name="Sample Supplier", contact_person="Contact Person", phone="042-1234567", city="Lahore")
    s2 = models.Supplier(name="Local Distributor", phone="021-9876543", city="Karachi")
    db.add_all([s1, s2])
    db.flush()

    # Basic chart of accounts
    accounts = [
        models.Account(name="Cash in Hand", account_type="asset", account_code="1001", balance=0),
        models.Account(name="Bank Account", account_type="asset", account_code="1002", balance=0),
        models.Account(name="Accounts Receivable", account_type="asset", account_code="1101", balance=0),
        models.Account(name="Accounts Payable", account_type="liability", account_code="2001", balance=0),
        models.Account(name="Sales Revenue", account_type="income", account_code="4001", balance=0),
        models.Account(name="Cost of Goods Sold", account_type="expense", account_code="5001", balance=0),
        models.Account(name="Owner's Equity", account_type="equity", account_code="3001", balance=0),
    ]
    db.add_all(accounts)
    db.flush()

    # 1 sample department + 1 employee
    dept = models.Department(name="Sales", description="Sales team")
    db.add(dept)
    db.flush()

    emp = models.Employee(
        name="Sample Employee", employee_id="EMP-001",
        department_id=dept.id, branch_id=branch_id,
        designation="Sales Executive", basic_salary=30000,
        allowances=2000, deductions=1000,
        join_date=datetime(2024, 1, 1), is_active=True,
    )
    db.add(emp)
    db.flush()

    # 1 demo sale
    now = datetime.utcnow()
    invoice_no = f"INV-{now.strftime('%Y%m')}-00001"
    sale = models.Sale(
        invoice_no=invoice_no, customer_id=c1.id,
        user_id=current_user.id, branch_id=branch_id,
        discount=0, tax=0, payment_method="cash", status="completed",
        subtotal=100, total=100, paid=100, balance=0, created_at=now,
    )
    db.add(sale)
    db.flush()

    item = models.SaleItem(
        sale_id=sale.id, product_id=p1.id,
        quantity=1, unit_price=100, discount=0, total=100,
    )
    db.add(item)

    db.commit()
    return {"message": "Reset successful. Demo data loaded.", "status": "ok"}
