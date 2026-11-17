"""Seed the database with minimal demo data - NO fake transactions."""
from database import engine, SessionLocal
import models
from auth import get_password_hash
from datetime import datetime
from sqlalchemy import inspect, text
import os
import secrets


# Lightweight additive migrations: columns added to models over time that must
# also be added to an EXISTING table (create_all never alters existing tables).
# Maps table -> {column_name: column DDL type}. Safe/idempotent on every boot.
_NEW_COLUMNS = {
    "products": {"generic_name": "VARCHAR(200)"},
    "company_settings": {"ntn": "VARCHAR(50)", "strn": "VARCHAR(50)"},
}


def ensure_columns():
    """Add any missing model columns to existing tables (no-op if present).

    Idempotent and safe to run on every boot: the ALTER is guarded so a column
    already present (stale reflection, or a concurrent boot) is simply skipped.
    """
    insp = inspect(engine)
    tables = set(insp.get_table_names())
    for table, cols in _NEW_COLUMNS.items():
        if table not in tables:
            continue  # create_all will build it with all columns
        have = {c["name"] for c in insp.get_columns(table)}
        for col, ddl in cols.items():
            if col in have:
                continue
            try:
                with engine.begin() as conn:
                    conn.execute(text(f'ALTER TABLE {table} ADD COLUMN {col} {ddl}'))
                print(f"Migration: added column {table}.{col}")
            except Exception as exc:  # already added elsewhere — safe to ignore
                print(f"Migration note: skipped {table}.{col} ({exc.__class__.__name__}).")


def _password(env_name):
    """Use the password from the environment, or generate a random one."""
    value = os.getenv(env_name, "").strip()
    return value if value else secrets.token_urlsafe(12)


def _apply_env_passwords(db):
    """Reset user passwords from env vars on every boot, if provided.

    Lets you choose/rotate the login password without wiping the database:
    set SEED_ADMIN_PASSWORD / SEED_DEMO_PASSWORD (and redeploy) and the
    matching accounts are updated. No-op when the vars are unset.
    """
    admin_email = os.getenv("SEED_ADMIN_EMAIL", "").strip() or "admin@probiz.pk"
    admin_pw = os.getenv("SEED_ADMIN_PASSWORD", "").strip()
    demo_pw = os.getenv("SEED_DEMO_PASSWORD", "").strip()

    updates = {}
    if admin_pw:
        updates[admin_email] = admin_pw
    if demo_pw:
        updates["manager@probiz.pk"] = demo_pw
        updates["cashier@probiz.pk"] = demo_pw

    changed = False
    for email, pw in updates.items():
        user = db.query(models.User).filter(models.User.email == email).first()
        if user:
            user.hashed_password = get_password_hash(pw)
            changed = True
    if changed:
        db.commit()
        print("Applied login password(s) from SEED_ADMIN_PASSWORD / SEED_DEMO_PASSWORD.")


# Salt/generic names for the demo products, by SKU. Backfilled on boot so an
# already-seeded database (created before the generic_name field existed) gets
# them without a wipe — makes salt search and the interaction checker work.
_DEMO_GENERICS = {
    "MED001": "Paracetamol",
    "MED002": "Amoxicillin + Clavulanic Acid",
    "GEN001": "Chloroxylenol",
}


def backfill_generics(db):
    """Fill generic_name on the demo products where it's still empty."""
    changed = False
    for sku, generic in _DEMO_GENERICS.items():
        p = db.query(models.Product).filter(models.Product.sku == sku).first()
        if p and not (p.generic_name or "").strip():
            p.generic_name = generic
            changed = True
    if changed:
        db.commit()
        print("Backfilled salt/generic names for demo products.")


def seed():
    models.Base.metadata.create_all(bind=engine)
    ensure_columns()
    db = SessionLocal()

    # Check if already seeded
    if db.query(models.User).count() > 0:
        print("Database already seeded.")
        _apply_env_passwords(db)
        backfill_generics(db)
        db.close()
        return

    print("Seeding database with clean demo data...")

    # Branch - only one main branch
    branch = models.Branch(
        name="Main Branch",
        city="Islamabad",
        address="Blue Area, Islamabad",
        phone="051-0000000"
    )
    db.add(branch)
    db.flush()

    # Users
    admin_email = os.getenv("SEED_ADMIN_EMAIL", "").strip() or "admin@probiz.pk"
    admin_password = _password("SEED_ADMIN_PASSWORD")
    demo_password = _password("SEED_DEMO_PASSWORD")
    users = [
        models.User(name="Administrator", email=admin_email, hashed_password=get_password_hash(admin_password), role="superadmin", branch_id=branch.id),
        models.User(name="Manager", email="manager@probiz.pk", hashed_password=get_password_hash(demo_password), role="manager", branch_id=branch.id),
        models.User(name="Cashier", email="cashier@probiz.pk", hashed_password=get_password_hash(demo_password), role="cashier", branch_id=branch.id),
    ]
    db.add_all(users)
    db.flush()

    # Categories - just 2
    categories = [
        models.Category(name="Medicines", description="Pharmaceutical products"),
        models.Category(name="General", description="General merchandise"),
    ]
    db.add_all(categories)
    db.flush()

    # Products - just 3 demo products
    products = [
        models.Product(name="Panadol 500mg", generic_name="Paracetamol", sku="MED001", category_id=categories[0].id, branch_id=branch.id, unit="strips", cost_price=80, sale_price=100, stock=50, min_stock=10),
        models.Product(name="Augmentin 625mg", generic_name="Amoxicillin + Clavulanic Acid", sku="MED002", category_id=categories[0].id, branch_id=branch.id, unit="strips", cost_price=450, sale_price=520, stock=20, min_stock=5),
        models.Product(name="Dettol Antiseptic", generic_name="Chloroxylenol", sku="GEN001", category_id=categories[1].id, branch_id=branch.id, unit="pcs", cost_price=120, sale_price=150, stock=60, min_stock=10),
    ]
    db.add_all(products)
    db.flush()

    # Customers - just 2
    customers = [
        models.Customer(name="Walk-in Customer", phone="0300-0000000"),
        models.Customer(name="Demo Pharmacy", phone="042-1234567", city="Lahore", credit_limit=50000),
    ]
    db.add_all(customers)
    db.flush()

    # Suppliers - just 2
    suppliers = [
        models.Supplier(name="Demo Supplier Co.", contact_person="Mr. Ali", phone="042-9876543", city="Lahore"),
        models.Supplier(name="MedSupply PK", phone="021-1234567", city="Karachi", contact_person="Ms. Sara"),
    ]
    db.add_all(suppliers)
    db.flush()

    # Accounts - standard chart of accounts, all balances zero
    accounts = [
        models.Account(name="Cash in Hand", account_type="asset", account_code="1001", balance=0),
        models.Account(name="Bank Account", account_type="asset", account_code="1002", balance=0),
        models.Account(name="Accounts Receivable", account_type="asset", account_code="1101", balance=0),
        models.Account(name="Inventory", account_type="asset", account_code="1201", balance=0),
        models.Account(name="Accounts Payable", account_type="liability", account_code="2001", balance=0),
        models.Account(name="Owner Equity", account_type="equity", account_code="3001", balance=0),
        models.Account(name="Sales Revenue", account_type="income", account_code="4001", balance=0),
        models.Account(name="Cost of Goods Sold", account_type="expense", account_code="5001", balance=0),
        models.Account(name="Salaries Expense", account_type="expense", account_code="5002", balance=0),
        models.Account(name="Rent Expense", account_type="expense", account_code="5003", balance=0),
    ]
    db.add_all(accounts)
    db.flush()

    # Department - just 1
    dept = models.Department(name="Operations", description="Main operations team")
    db.add(dept)
    db.flush()

    # Employee - just 1 demo
    emp = models.Employee(
        name="Demo Employee",
        employee_id="EMP-001",
        department_id=dept.id,
        branch_id=branch.id,
        designation="Staff",
        basic_salary=30000,
        allowances=2000,
        deductions=0,
        join_date=datetime(2024, 1, 1),
        is_active=True,
    )
    db.add(emp)

    # NO fake sales, purchases, or transactions created
    # The system starts clean — add real data as you use it

    db.commit()
    print("Clean demo database seeded successfully!")
    print("\nLogin credentials (shown once; set SEED_ADMIN_PASSWORD / SEED_DEMO_PASSWORD to choose your own):")
    print(f"  Admin:    {admin_email} / {admin_password}")
    print(f"  Manager:  manager@probiz.pk / {demo_password}")
    print(f"  Cashier:  cashier@probiz.pk / {demo_password}")
    db.close()

if __name__ == "__main__":
    seed()
