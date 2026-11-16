"""Company / business settings — a single persisted row edited from the UI."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from auth import get_current_user, require_roles
import models

router = APIRouter(prefix="/api/settings", tags=["settings"])


class SettingsIn(BaseModel):
    company_name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    currency: Optional[str] = None
    tax_rate: Optional[float] = None
    invoice_prefix: Optional[str] = None
    po_prefix: Optional[str] = None
    fiscal_year_start: Optional[str] = None


def get_or_create(db: Session) -> models.CompanySettings:
    row = db.query(models.CompanySettings).first()
    if not row:
        row = models.CompanySettings()
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


def _serialize(s: models.CompanySettings) -> dict:
    return {
        "company_name": s.company_name or "",
        "address": s.address or "",
        "phone": s.phone or "",
        "email": s.email or "",
        "currency": s.currency or "PKR (Rs.)",
        "tax_rate": s.tax_rate or 0.0,
        "invoice_prefix": s.invoice_prefix or "INV-",
        "po_prefix": s.po_prefix or "PO-",
        "fiscal_year_start": s.fiscal_year_start or "January",
    }


@router.get("")
def get_settings(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return _serialize(get_or_create(db))


@router.put("")
def update_settings(data: SettingsIn, db: Session = Depends(get_db),
                    _=Depends(require_roles("admin", "manager"))):
    row = get_or_create(db)
    for field, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return {"message": "Settings saved", "settings": _serialize(row)}
