from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from auth import get_current_user
import models
from datetime import datetime

router = APIRouter(prefix="/api/sales", tags=["sales"])

class SaleItemIn(BaseModel):
    product_id: int
    quantity: float
    unit_price: float
    discount: float = 0.0

class SaleCreate(BaseModel):
    customer_id: Optional[int] = None
    branch_id: Optional[int] = None
    items: List[SaleItemIn]
    discount: float = 0.0
    tax: float = 0.0
    paid: float = 0.0
    payment_method: str = "cash"
    notes: Optional[str] = None

class CustomerCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    credit_limit: float = 0.0

@router.get("/customers")
def get_customers(search: Optional[str] = Query(None), db: Session = Depends(get_db), _=Depends(get_current_user)):
    q = db.query(models.Customer).filter(models.Customer.is_active == True)
    if search:
        q = q.filter(or_(models.Customer.name.ilike(f"%{search}%"), models.Customer.phone.ilike(f"%{search}%")))
    customers = q.all()
    return [{"id": c.id, "name": c.name, "phone": c.phone, "city": c.city, "balance": c.balance, "credit_limit": c.credit_limit} for c in customers]

@router.post("/customers")
def create_customer(data: CustomerCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    c = models.Customer(**data.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return {"id": c.id, "name": c.name}

@router.put("/customers/{cid}")
def update_customer(cid: int, data: CustomerCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    c = db.query(models.Customer).filter(models.Customer.id == cid).first()
    if not c:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.model_dump().items():
        setattr(c, k, v)
    db.commit()
    return {"message": "Updated"}

@router.get("/")
def get_sales(
    search: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    skip: int = 0, limit: int = 50,
    db: Session = Depends(get_db), _=Depends(get_current_user)
):
    q = db.query(models.Sale)
    if search:
        q = q.filter(models.Sale.invoice_no.ilike(f"%{search}%"))
    if from_date:
        q = q.filter(models.Sale.created_at >= from_date)
    if to_date:
        q = q.filter(models.Sale.created_at <= to_date)
    total = q.count()
    sales = q.order_by(models.Sale.created_at.desc()).offset(skip).limit(limit).all()
    return {
        "total": total,
        "sales": [{
            "id": s.id, "invoice_no": s.invoice_no,
            "customer": s.customer.name if s.customer else "Walk-in",
            "total": s.total, "paid": s.paid, "balance": s.balance,
            "payment_method": s.payment_method, "status": s.status,
            "items_count": len(s.items),
            "created_at": s.created_at.isoformat() if s.created_at else None,
        } for s in sales]
    }

@router.get("/{sale_id}")
def get_sale(sale_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    s = db.query(models.Sale).filter(models.Sale.id == sale_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Sale not found")
    return {
        "id": s.id, "invoice_no": s.invoice_no,
        "customer": {"id": s.customer.id, "name": s.customer.name} if s.customer else None,
        "subtotal": s.subtotal, "discount": s.discount, "tax": s.tax,
        "total": s.total, "paid": s.paid, "balance": s.balance,
        "payment_method": s.payment_method, "status": s.status, "notes": s.notes,
        "created_at": s.created_at.isoformat() if s.created_at else None,
        "items": [{
            "product_id": i.product_id,
            "product_name": i.product.name if i.product else "",
            "quantity": i.quantity, "unit_price": i.unit_price,
            "discount": i.discount, "total": i.total,
            "batch_no": i.product.batch_no if i.product else None,
            "mfg_date": i.product.mfg_date if i.product else None,
            "expiry_date": i.product.expiry_date if i.product else None,
        } for i in s.items]
    }

@router.post("/")
def create_sale(data: SaleCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Generate invoice number
    count = db.query(models.Sale).count() + 1
    invoice_no = f"INV-{datetime.now().strftime('%Y%m')}-{count:05d}"

    subtotal = sum(item.quantity * item.unit_price - item.discount for item in data.items)
    total = subtotal - data.discount + data.tax
    balance = total - data.paid

    sale = models.Sale(
        invoice_no=invoice_no,
        customer_id=data.customer_id,
        user_id=current_user.id,
        branch_id=data.branch_id,
        subtotal=subtotal,
        discount=data.discount,
        tax=data.tax,
        total=total,
        paid=data.paid,
        balance=balance,
        payment_method=data.payment_method,
        status="completed",
        notes=data.notes,
    )
    db.add(sale)
    db.flush()

    for item_data in data.items:
        product = db.query(models.Product).filter(models.Product.id == item_data.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item_data.product_id} not found")
        if product.stock < item_data.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        product.stock -= item_data.quantity
        item = models.SaleItem(
            sale_id=sale.id,
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            discount=item_data.discount,
            total=item_data.quantity * item_data.unit_price - item_data.discount,
        )
        db.add(item)

    if data.customer_id:
        customer = db.query(models.Customer).filter(models.Customer.id == data.customer_id).first()
        if customer:
            customer.balance += balance

    db.commit()
    return {"id": sale.id, "invoice_no": invoice_no, "total": total}

@router.delete("/{sale_id}")
def void_sale(sale_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    s = db.query(models.Sale).filter(models.Sale.id == sale_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    # Restore stock
    for item in s.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if product:
            product.stock += item.quantity
    s.status = "voided"
    db.commit()
    return {"message": "Sale voided"}
