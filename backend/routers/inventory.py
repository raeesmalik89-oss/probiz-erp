from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime, date
from database import get_db
from auth import get_current_user
import models

router = APIRouter(prefix="/api/inventory", tags=["inventory"])

# How many days out counts as "near expiry" in list/badge responses.
NEAR_EXPIRY_DAYS = 90


def _expiry_info(expiry_date_str: Optional[str]):
    """Return (days_to_expiry, status) from a stored 'YYYY-MM-DD' string.

    status is one of: "expired", "near_expiry", "ok". Returns (None, "ok")
    when there is no parseable expiry date, so missing dates never flag.
    """
    if not expiry_date_str:
        return None, "ok"
    try:
        exp = datetime.strptime(expiry_date_str.strip()[:10], "%Y-%m-%d").date()
    except (ValueError, AttributeError):
        return None, "ok"
    days = (exp - date.today()).days
    if days < 0:
        status = "expired"
    elif days <= NEAR_EXPIRY_DAYS:
        status = "near_expiry"
    else:
        status = "ok"
    return days, status

# --- Categories ---
class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

@router.get("/categories")
def get_categories(db: Session = Depends(get_db), _=Depends(get_current_user)):
    cats = db.query(models.Category).all()
    return [{"id": c.id, "name": c.name, "description": c.description, "product_count": len(c.products)} for c in cats]

@router.post("/categories")
def create_category(data: CategoryCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    cat = models.Category(**data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {"id": cat.id, "name": cat.name}

@router.delete("/categories/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    cat = db.query(models.Category).filter(models.Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(cat)
    db.commit()
    return {"message": "Deleted"}

# --- Products ---
class ProductCreate(BaseModel):
    name: str
    generic_name: Optional[str] = None
    barcode: Optional[str] = None
    sku: Optional[str] = None
    category_id: Optional[int] = None
    branch_id: Optional[int] = None
    description: Optional[str] = None
    unit: str = "pcs"
    cost_price: float = 0.0
    sale_price: float = 0.0
    wholesale_price: Optional[float] = None
    stock: float = 0.0
    min_stock: float = 0.0
    max_stock: Optional[float] = None
    batch_no: Optional[str] = None
    mfg_date: Optional[str] = None
    expiry_date: Optional[str] = None
    shelf_location: Optional[str] = None
    rack: Optional[str] = None
    bin: Optional[str] = None

    @field_validator("expiry_date", "mfg_date")
    @classmethod
    def _validate_date_format(cls, v):
        # Keep dates as YYYY-MM-DD so near-expiry comparisons stay correct.
        if v in (None, ""):
            return v
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format")
        return v

@router.get("/products")
def get_products(
    search: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    low_stock: Optional[bool] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _=Depends(get_current_user)
):
    q = db.query(models.Product).filter(models.Product.is_active == True)
    if search:
        q = q.filter(or_(
            models.Product.name.ilike(f"%{search}%"),
            models.Product.generic_name.ilike(f"%{search}%"),
            models.Product.barcode.ilike(f"%{search}%"),
            models.Product.sku.ilike(f"%{search}%"),
        ))
    if category_id:
        q = q.filter(models.Product.category_id == category_id)
    if low_stock:
        q = q.filter(models.Product.stock <= models.Product.min_stock)
    total = q.count()
    products = q.offset(skip).limit(limit).all()

    def _row(p):
        days, status = _expiry_info(p.expiry_date)
        return {
            "id": p.id, "name": p.name, "generic_name": p.generic_name,
            "barcode": p.barcode, "sku": p.sku,
            "category": p.category.name if p.category else None,
            "category_id": p.category_id,
            "unit": p.unit, "cost_price": p.cost_price, "sale_price": p.sale_price,
            "wholesale_price": p.wholesale_price, "stock": p.stock,
            "min_stock": p.min_stock, "max_stock": p.max_stock,
            "batch_no": p.batch_no, "mfg_date": p.mfg_date, "expiry_date": p.expiry_date,
            "shelf_location": p.shelf_location, "rack": p.rack, "bin": p.bin,
            "days_to_expiry": days, "expiry_status": status,
            "low_stock": p.stock <= p.min_stock,
        }

    return {"total": total, "products": [_row(p) for p in products]}


@router.get("/near-expiry")
def near_expiry(
    days: int = Query(NEAR_EXPIRY_DAYS, ge=1, le=3650),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Active products expiring within `days` (and already-expired ones),
    soonest first, each with its shelf location for pulling off the floor."""
    products = db.query(models.Product).filter(
        models.Product.is_active == True,
        models.Product.expiry_date.isnot(None),
        models.Product.expiry_date != "",
    ).all()
    results = []
    for p in products:
        d, status = _expiry_info(p.expiry_date)
        if d is None or d > days:
            continue
        results.append({
            "id": p.id, "name": p.name, "generic_name": p.generic_name,
            "batch_no": p.batch_no, "stock": p.stock, "unit": p.unit,
            "shelf_location": p.shelf_location, "rack": p.rack, "bin": p.bin,
            "expiry_date": p.expiry_date, "days_to_expiry": d, "expiry_status": status,
        })
    results.sort(key=lambda r: r["days_to_expiry"])
    return {"total": len(results), "days": days, "products": results}

@router.get("/products/by-barcode/{barcode}")
def get_product_by_barcode(barcode: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Exact-match lookup for POS barcode scanning."""
    p = db.query(models.Product).filter(
        models.Product.barcode == barcode,
        models.Product.is_active == True,
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="No product with that barcode")
    days, status = _expiry_info(p.expiry_date)
    return {
        "id": p.id, "name": p.name, "generic_name": p.generic_name,
        "barcode": p.barcode, "sku": p.sku,
        "category": p.category.name if p.category else None,
        "unit": p.unit, "sale_price": p.sale_price, "stock": p.stock,
        "shelf_location": p.shelf_location, "rack": p.rack, "bin": p.bin,
        "expiry_date": p.expiry_date, "days_to_expiry": days, "expiry_status": status,
    }


@router.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    days, status = _expiry_info(p.expiry_date)
    return {
        "id": p.id, "name": p.name, "generic_name": p.generic_name,
        "barcode": p.barcode, "sku": p.sku,
        "category_id": p.category_id, "unit": p.unit, "description": p.description,
        "cost_price": p.cost_price, "sale_price": p.sale_price,
        "wholesale_price": p.wholesale_price, "stock": p.stock,
        "min_stock": p.min_stock, "max_stock": p.max_stock,
        "batch_no": p.batch_no, "mfg_date": p.mfg_date, "expiry_date": p.expiry_date,
        "shelf_location": p.shelf_location, "rack": p.rack, "bin": p.bin,
        "days_to_expiry": days, "expiry_status": status,
    }

@router.post("/products")
def create_product(data: ProductCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    product = models.Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"id": product.id, "name": product.name}

@router.put("/products/{product_id}")
def update_product(product_id: int, data: ProductCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    for k, v in data.model_dump().items():
        setattr(p, k, v)
    db.commit()
    return {"message": "Updated"}

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    p.is_active = False
    db.commit()
    return {"message": "Deleted"}

@router.post("/products/{product_id}/adjust-stock")
def adjust_stock(product_id: int, adjustment: float, reason: str = "manual", db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    p.stock += adjustment
    db.commit()
    return {"message": "Stock adjusted", "new_stock": p.stock}

# --- Suppliers ---
class SupplierCreate(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: str
    address: Optional[str] = None
    city: Optional[str] = None

@router.get("/suppliers")
def get_suppliers(search: Optional[str] = Query(None), db: Session = Depends(get_db), _=Depends(get_current_user)):
    q = db.query(models.Supplier).filter(models.Supplier.is_active == True)
    if search:
        q = q.filter(or_(models.Supplier.name.ilike(f"%{search}%"), models.Supplier.phone.ilike(f"%{search}%")))
    suppliers = q.all()
    return [{"id": s.id, "name": s.name, "phone": s.phone, "city": s.city, "balance": s.balance, "contact_person": s.contact_person} for s in suppliers]

@router.post("/suppliers")
def create_supplier(data: SupplierCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    supplier = models.Supplier(**data.model_dump())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return {"id": supplier.id, "name": supplier.name}

@router.put("/suppliers/{supplier_id}")
def update_supplier(supplier_id: int, data: SupplierCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    s = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Supplier not found")
    for k, v in data.model_dump().items():
        setattr(s, k, v)
    db.commit()
    return {"message": "Updated"}

@router.delete("/suppliers/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    s = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    s.is_active = False
    db.commit()
    return {"message": "Deleted"}

# --- Branches ---
class BranchCreate(BaseModel):
    name: str
    city: str
    address: Optional[str] = None
    phone: Optional[str] = None

@router.get("/branches")
def get_branches(db: Session = Depends(get_db), _=Depends(get_current_user)):
    branches = db.query(models.Branch).filter(models.Branch.is_active == True).all()
    return [{"id": b.id, "name": b.name, "city": b.city, "address": b.address, "phone": b.phone} for b in branches]

@router.post("/branches")
def create_branch(data: BranchCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    branch = models.Branch(**data.model_dump())
    db.add(branch)
    db.commit()
    db.refresh(branch)
    return {"id": branch.id, "name": branch.name}
