from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from auth import get_current_user
import models

router = APIRouter(prefix="/api/demo", tags=["demo"])

class DemoRequestIn(BaseModel):
    name: str
    business: str
    phone: str
    email: str
    industry: Optional[str] = None
    message: Optional[str] = None

@router.post("/request")
def submit_demo_request(data: DemoRequestIn, db: Session = Depends(get_db)):
    """Public endpoint — no auth required"""
    req = models.DemoRequest(
        name=data.name,
        business=data.business,
        phone=data.phone,
        email=data.email,
        industry=data.industry,
        message=data.message,
        status="new",
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return {"message": "Demo request received! We'll contact you within 24 hours.", "id": req.id}

@router.get("/requests")
def list_demo_requests(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Superadmin only"""
    if current_user.role not in ("superadmin", "admin"):
        raise HTTPException(status_code=403, detail="Admins only")
    reqs = db.query(models.DemoRequest).order_by(models.DemoRequest.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "name": r.name,
            "business": r.business,
            "phone": r.phone,
            "email": r.email,
            "industry": r.industry,
            "message": r.message,
            "status": r.status,
            "created_at": str(r.created_at),
        }
        for r in reqs
    ]

class UpdateStatusIn(BaseModel):
    status: str  # new, contacted, activated, closed

@router.patch("/requests/{req_id}")
def update_demo_status(req_id: int, data: UpdateStatusIn, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role not in ("superadmin", "admin"):
        raise HTTPException(status_code=403, detail="Admins only")
    req = db.query(models.DemoRequest).filter(models.DemoRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    req.status = data.status
    db.commit()
    return {"message": "Status updated"}
