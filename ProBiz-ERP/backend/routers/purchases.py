from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from auth import get_current_user
import models
from datetime import datetime

router = APIRouter(prefix="/api/purchases", tags=["purchases"])

class PurchaseItemIn(BaseModel):
    product_id: int
    quantity: float
    unit_cost: float

class PurchaseCreate(BaseModel):
    supplier_id: int
    branch_id: Optional[int] = None
    items: List[PurchaseItemIn]
    discount: float = 0.0
    tax: float = 0.0
    paid: float = 0.0
    payment_method: str = "cash"
    notes: Optional[str] = None

@router.get("/")
def get_purchases(
    search: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    skip: int = 0, limit: int = 50,
    db: Session = Depends(get_db), _=Depends(get_current_user)
):
    q = db.query(models.Purchase)
    if search:
        q = q.filter(models.Purchase.po_number.ilike(f"%{search}%"))
    if from_date:
        q = q.filter(models.Purchase.created_at >= from_date)
    if to_date:
        q = q.filter(models.Purchase.created_at <= to_date)
    total = q.count()
    purchases = q.order_by(models.Purchase.created_at.desc()).offset(skip).limit(limit).all()
    return {
        "total": total,
        "purchases": [{
            "id": p.id, "po_number": p.po_number,
            "supplier": p.supplier.name if p.supplier else "",
            "total": p.total, "paid": p.paid, "balance": p.balance,
            "payment_method": p.payment_method, "status": p.status,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        } for p in purchases]
    }

@router.get("/{purchase_id}")
def get_purchase(purchase_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(models.Purchase).filter(models.Purchase.id == purchase_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return {
        "id": p.id, "po_number": p.po_number,
        "supplier": {"id": p.supplier.id, "name": p.supplier.name} if p.supplier else None,
        "subtotal": p.subtotal, "discount": p.discount, "tax": p.tax,
        "total": p.total, "paid": p.paid, "balance": p.balance,
        "payment_method": p.payment_method, "notes": p.notes,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "items": [{
            "product_id": i.product_id,
            "product_name": i.product.name if i.product else "",
            "quantity": i.quantity, "unit_cost": i.unit_cost, "total": i.total,
        } for i in p.items]
    }

@router.post("/")
def create_purchase(data: PurchaseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    count = db.query(models.Purchase).count() + 1
    po_number = f"PO-{datetime.now().strftime('%Y%m')}-{count:05d}"

    subtotal = sum(item.quantity * item.unit_cost for item in data.items)
    total = subtotal - data.discount + data.tax
    balance = total - data.paid

    purchase = models.Purchase(
        po_number=po_number,
        supplier_id=data.supplier_id,
        user_id=current_user.id,
        branch_id=data.branch_id,
        subtotal=subtotal,
        discount=data.discount,
        tax=data.tax,
        total=total,
        paid=data.paid,
        balance=balance,
        payment_method=data.payment_method,
        status="received",
        notes=data.notes,
    )
    db.add(purchase)
    db.flush()

    for item_data in data.items:
        product = db.query(models.Product).filter(models.Product.id == item_data.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item_data.product_id} not found")
        product.stock += item_data.quantity
        product.cost_price = item_data.unit_cost
        item = models.PurchaseItem(
            purchase_id=purchase.id,
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            unit_cost=item_data.unit_cost,
            total=item_data.quantity * item_data.unit_cost,
        )
        db.add(item)

    supplier = db.query(models.Supplier).filter(models.Supplier.id == data.supplier_id).first()
    if supplier:
        supplier.balance += balance

    db.commit()
    return {"id": purchase.id, "po_number": po_number, "total": total}
