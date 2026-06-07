from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from database import get_db
from auth import get_current_user
import models
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), _=Depends(get_current_user)):
    today = datetime.utcnow().date()
    month_start = today.replace(day=1)

    # Today's sales
    today_sales = db.query(func.coalesce(func.sum(models.Sale.total), 0)).filter(
        func.date(models.Sale.created_at) == today,
        models.Sale.status == "completed"
    ).scalar()

    # Month sales
    month_sales = db.query(func.coalesce(func.sum(models.Sale.total), 0)).filter(
        models.Sale.created_at >= month_start,
        models.Sale.status == "completed"
    ).scalar()

    # Total products
    total_products = db.query(models.Product).filter(models.Product.is_active == True).count()

    # Low stock products
    low_stock = db.query(models.Product).filter(
        models.Product.is_active == True,
        models.Product.stock <= models.Product.min_stock
    ).count()

    # Total customers
    total_customers = db.query(models.Customer).filter(models.Customer.is_active == True).count()

    # Total suppliers
    total_suppliers = db.query(models.Supplier).filter(models.Supplier.is_active == True).count()

    # Pending payables (to suppliers)
    total_payables = db.query(func.coalesce(func.sum(models.Supplier.balance), 0)).scalar()

    # Pending receivables (from customers)
    total_receivables = db.query(func.coalesce(func.sum(models.Customer.balance), 0)).scalar()

    # Month purchases
    month_purchases = db.query(func.coalesce(func.sum(models.Purchase.total), 0)).filter(
        models.Purchase.created_at >= month_start,
        models.Purchase.status == "received"
    ).scalar()

    # Active employees
    total_employees = db.query(models.Employee).filter(models.Employee.is_active == True).count()

    return {
        "today_sales": float(today_sales),
        "month_sales": float(month_sales),
        "month_purchases": float(month_purchases),
        "total_products": total_products,
        "low_stock_count": low_stock,
        "total_customers": total_customers,
        "total_suppliers": total_suppliers,
        "total_payables": float(total_payables),
        "total_receivables": float(total_receivables),
        "total_employees": total_employees,
    }

@router.get("/sales-chart")
def get_sales_chart(db: Session = Depends(get_db), _=Depends(get_current_user)):
    # Last 7 days sales
    result = []
    for i in range(6, -1, -1):
        day = datetime.utcnow().date() - timedelta(days=i)
        amount = db.query(func.coalesce(func.sum(models.Sale.total), 0)).filter(
            func.date(models.Sale.created_at) == day,
            models.Sale.status == "completed"
        ).scalar()
        result.append({"date": day.strftime("%b %d"), "sales": float(amount)})
    return result

@router.get("/top-products")
def get_top_products(db: Session = Depends(get_db), _=Depends(get_current_user)):
    top = db.query(
        models.Product.name,
        func.sum(models.SaleItem.quantity).label("total_qty"),
        func.sum(models.SaleItem.total).label("total_revenue"),
    ).join(models.SaleItem, models.Product.id == models.SaleItem.product_id)\
     .group_by(models.Product.id)\
     .order_by(func.sum(models.SaleItem.total).desc())\
     .limit(5).all()
    return [{"name": t.name, "quantity": float(t.total_qty), "revenue": float(t.total_revenue)} for t in top]

@router.get("/low-stock")
def get_low_stock(db: Session = Depends(get_db), _=Depends(get_current_user)):
    products = db.query(models.Product).filter(
        models.Product.is_active == True,
        models.Product.stock <= models.Product.min_stock
    ).limit(10).all()
    return [{"id": p.id, "name": p.name, "stock": p.stock, "min_stock": p.min_stock, "unit": p.unit} for p in products]

@router.get("/recent-sales")
def get_recent_sales(db: Session = Depends(get_db), _=Depends(get_current_user)):
    sales = db.query(models.Sale).order_by(models.Sale.created_at.desc()).limit(8).all()
    return [{
        "id": s.id, "invoice_no": s.invoice_no,
        "customer": s.customer.name if s.customer else "Walk-in",
        "total": s.total, "status": s.status,
        "created_at": s.created_at.isoformat() if s.created_at else None,
    } for s in sales]

@router.get("/monthly-comparison")
def get_monthly_comparison(db: Session = Depends(get_db), _=Depends(get_current_user)):
    result = []
    now = datetime.utcnow()
    for i in range(5, -1, -1):
        month = (now.month - i - 1) % 12 + 1
        year = now.year - ((now.month - i - 1) // 12)
        sales = db.query(func.coalesce(func.sum(models.Sale.total), 0)).filter(
            extract("month", models.Sale.created_at) == month,
            extract("year", models.Sale.created_at) == year,
            models.Sale.status == "completed"
        ).scalar()
        purchases = db.query(func.coalesce(func.sum(models.Purchase.total), 0)).filter(
            extract("month", models.Purchase.created_at) == month,
            extract("year", models.Purchase.created_at) == year,
        ).scalar()
        result.append({
            "month": datetime(year, month, 1).strftime("%b %Y"),
            "sales": float(sales),
            "purchases": float(purchases),
        })
    return result
