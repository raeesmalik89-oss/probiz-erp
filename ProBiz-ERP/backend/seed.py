"""Seed the database with demo data."""
from database import engine, SessionLocal
import models
from auth import get_password_hash
from datetime import datetime, timedelta
import random

def seed():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(models.User).count() > 0:
        print("Database already seeded.")
        db.close()
        return

    print("Seeding database...")

    # Branches
    branches = [
        models.Branch(name="Main Branch - Lahore", city="Lahore", address="1 Main Blvd, Gulberg", phone="042-111-222-333"),
        models.Branch(name="Karachi Branch", city="Karachi", address="45 Clifton Road", phone="021-111-222-333"),
        models.Branch(name="Islamabad Branch", city="Islamabad", address="F-7 Markaz", phone="051-111-222-333"),
    ]
    db.add_all(branches)
    db.flush()

    # Users
    users = [
        models.User(name="Admin User", email="admin@probiz.pk", hashed_password=get_password_hash("admin123"), role="superadmin", branch_id=branches[0].id),
        models.User(name="Manager One", email="manager@probiz.pk", hashed_password=get_password_hash("manager123"), role="manager", branch_id=branches[0].id),
        models.User(name="Cashier Ali", email="cashier@probiz.pk", hashed_password=get_password_hash("cashier123"), role="cashier", branch_id=branches[0].id),
        models.User(name="Accountant Sara", email="accountant@probiz.pk", hashed_password=get_password_hash("acc123"), role="accountant", branch_id=branches[0].id),
    ]
    db.add_all(users)
    db.flush()

    # Categories
    categories = [
        models.Category(name="Medicines", description="Pharmaceutical products"),
        models.Category(name="Surgical", description="Surgical instruments and supplies"),
        models.Category(name="Cosmetics", description="Beauty and skincare products"),
        models.Category(name="Vitamins", description="Vitamins and supplements"),
        models.Category(name="Baby Care", description="Baby care products"),
        models.Category(name="General", description="General merchandise"),
    ]
    db.add_all(categories)
    db.flush()

    # Products
    product_data = [
        ("Panadol 500mg", "MED001", categories[0].id, "strips", 80, 100, 50),
        ("Augmentin 625mg", "MED002", categories[0].id, "strips", 450, 520, 20),
        ("ORS Sachets", "MED003", categories[0].id, "pcs", 15, 20, 100),
        ("Surgical Gloves M", "SUR001", categories[1].id, "pair", 30, 45, 200),
        ("Disposable Syringe 5ml", "SUR002", categories[1].id, "pcs", 8, 12, 500),
        ("Face Wash Clean", "COS001", categories[2].id, "pcs", 250, 320, 30),
        ("Vitamin C 1000mg", "VIT001", categories[3].id, "pcs", 350, 450, 40),
        ("Multivitamin Plus", "VIT002", categories[3].id, "pcs", 580, 700, 25),
        ("Baby Lotion 200ml", "BAB001", categories[4].id, "pcs", 180, 240, 35),
        ("Dettol Antiseptic", "GEN001", categories[5].id, "pcs", 120, 150, 60),
    ]
    products = []
    for name, sku, cat_id, unit, cost, price, stock in product_data:
        p = models.Product(
            name=name, sku=sku, category_id=cat_id,
            branch_id=branches[0].id, unit=unit,
            cost_price=cost, sale_price=price, stock=stock, min_stock=10,
        )
        db.add(p)
        products.append(p)
    db.flush()

    # Suppliers
    suppliers = [
        models.Supplier(name="PharmaCorp Ltd", contact_person="Mr. Zafar", email="zafar@pharmacorp.pk", phone="042-3456789", city="Lahore"),
        models.Supplier(name="MedSupply Pakistan", phone="021-9876543", city="Karachi", contact_person="Ms. Ayesha"),
        models.Supplier(name="HealthPro Distributors", phone="051-2345678", city="Islamabad"),
    ]
    db.add_all(suppliers)
    db.flush()

    # Customers
    customers = [
        models.Customer(name="City Hospital", phone="042-1111111", city="Lahore", credit_limit=100000),
        models.Customer(name="Al-Shifa Pharmacy", phone="042-2222222", city="Lahore", credit_limit=50000),
        models.Customer(name="General Walk-in", phone="0300-0000000"),
        models.Customer(name="Doctors Clinic", phone="051-3333333", city="Islamabad", credit_limit=30000),
    ]
    db.add_all(customers)
    db.flush()

    # Accounts
    accounts = [
        models.Account(name="Cash in Hand", account_type="asset", account_code="1001", balance=500000),
        models.Account(name="Bank Account - HBL", account_type="asset", account_code="1002", balance=1500000),
        models.Account(name="Accounts Receivable", account_type="asset", account_code="1101", balance=0),
        models.Account(name="Inventory", account_type="asset", account_code="1201", balance=0),
        models.Account(name="Accounts Payable", account_type="liability", account_code="2001", balance=0),
        models.Account(name="Sales Revenue", account_type="income", account_code="4001", balance=0),
        models.Account(name="Cost of Goods Sold", account_type="expense", account_code="5001", balance=0),
        models.Account(name="Salaries Expense", account_type="expense", account_code="5002", balance=0),
        models.Account(name="Rent Expense", account_type="expense", account_code="5003", balance=50000),
        models.Account(name="Owner's Equity", account_type="equity", account_code="3001", balance=2000000),
    ]
    db.add_all(accounts)
    db.flush()

    # Departments
    departments = [
        models.Department(name="Sales", description="Sales team"),
        models.Department(name="Pharmacy", description="Pharmacy operations"),
        models.Department(name="Administration", description="Admin staff"),
        models.Department(name="Accounts", description="Finance team"),
    ]
    db.add_all(departments)
    db.flush()

    # Employees
    emp_data = [
        ("Muhammad Ali", "EMP-001", departments[0].id, "Sales Executive", 35000, 5000),
        ("Fatima Malik", "EMP-002", departments[1].id, "Pharmacist", 55000, 8000),
        ("Hassan Khan", "EMP-003", departments[2].id, "Admin Officer", 30000, 3000),
        ("Sara Ahmed", "EMP-004", departments[3].id, "Accountant", 45000, 5000),
        ("Usman Raza", "EMP-005", departments[0].id, "Cashier", 25000, 2000),
    ]
    for name, eid, dept_id, designation, salary, allowance in emp_data:
        e = models.Employee(
            name=name, employee_id=eid, department_id=dept_id,
            branch_id=branches[0].id, designation=designation,
            basic_salary=salary, allowances=allowance, deductions=2000,
            join_date=datetime(2023, 1, 1), is_active=True,
        )
        db.add(e)

    # Generate some sample sales
    for i in range(15):
        days_ago = random.randint(0, 30)
        sale_date = datetime.utcnow() - timedelta(days=days_ago)
        count = db.query(models.Sale).count() + 1
        invoice_no = f"INV-{sale_date.strftime('%Y%m')}-{count:05d}"
        num_items = random.randint(1, 3)
        sale_products = random.sample(products, min(num_items, len(products)))
        subtotal = 0
        sale = models.Sale(
            invoice_no=invoice_no,
            customer_id=random.choice(customers).id,
            user_id=users[2].id,
            branch_id=branches[0].id,
            discount=0, tax=0, payment_method="cash", status="completed",
        )
        db.add(sale)
        db.flush()
        for prod in sale_products:
            qty = random.randint(1, 5)
            item_total = qty * prod.sale_price
            subtotal += item_total
            item = models.SaleItem(
                sale_id=sale.id, product_id=prod.id,
                quantity=qty, unit_price=prod.sale_price,
                discount=0, total=item_total,
            )
            db.add(item)
        sale.subtotal = subtotal
        sale.total = subtotal
        sale.paid = subtotal
        sale.balance = 0
        sale.created_at = sale_date

    db.commit()
    print("Database seeded successfully!")
    print("\nDemo credentials:")
    print("  Admin:      admin@probiz.pk     / admin123")
    print("  Manager:    manager@probiz.pk   / manager123")
    print("  Cashier:    cashier@probiz.pk   / cashier123")
    print("  Accountant: accountant@probiz.pk / acc123")
    db.close()

if __name__ == "__main__":
    seed()
