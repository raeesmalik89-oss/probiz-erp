from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from auth import get_current_user
import models
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/subscription", tags=["subscription"])

PLANS = {
    "trial":        {"name": "Free Trial",     "price": 0,      "days": 14, "max_users": 3,  "max_branches": 1},
    "basic":        {"name": "Basic",          "price": 2500,   "days": 30, "max_users": 3,  "max_branches": 1},
    "professional": {"name": "Professional",   "price": 5000,   "days": 30, "max_users": 10, "max_branches": 3},
    "enterprise":   {"name": "Enterprise",     "price": 15000,  "days": 30, "max_users": 999,"max_branches": 999},
}

def get_or_create_subscription(db: Session):
    sub = db.query(models.Subscription).first()
    if not sub:
        today = datetime.now().date()
        trial_end = today + timedelta(days=14)
        sub = models.Subscription(
            business_name="ProBiz Pharmacy",
            plan="trial",
            status="active",
            trial_start=str(today),
            trial_end=str(trial_end),
            max_users=3,
            max_branches=1,
        )
        db.add(sub)
        db.commit()
        db.refresh(sub)
    return sub

def check_subscription_active(db: Session):
    sub = get_or_create_subscription(db)
    today = str(datetime.now().date())

    if sub.plan == "trial":
        if sub.trial_end and today > sub.trial_end:
            sub.status = "expired"
            db.commit()
            return sub, False
    elif sub.plan in ("basic", "professional", "enterprise"):
        if sub.paid_until and today > sub.paid_until:
            sub.status = "expired"
            db.commit()
            return sub, False

    sub.status = "active"
    db.commit()
    return sub, True

@router.get("/status")
def get_status(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    sub, is_active = check_subscription_active(db)
    today = datetime.now().date()

    # Calculate days remaining
    days_remaining = 0
    if sub.plan == "trial" and sub.trial_end:
        end = datetime.strptime(sub.trial_end, "%Y-%m-%d").date()
        days_remaining = max(0, (end - today).days)
    elif sub.paid_until:
        end = datetime.strptime(sub.paid_until, "%Y-%m-%d").date()
        days_remaining = max(0, (end - today).days)

    plan_info = PLANS.get(sub.plan, PLANS["trial"])

    return {
        "plan": sub.plan,
        "plan_name": plan_info["name"],
        "status": sub.status,
        "is_active": is_active,
        "days_remaining": days_remaining,
        "trial_end": sub.trial_end,
        "paid_until": sub.paid_until,
        "business_name": sub.business_name,
        "max_users": sub.max_users,
        "max_branches": sub.max_branches,
        "plans": PLANS,
    }

class ActivateRequest(BaseModel):
    plan: str
    months: int = 1
    business_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None

@router.post("/activate")
def activate_plan(data: ActivateRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role not in ("superadmin", "admin"):
        raise HTTPException(status_code=403, detail="Only admin can activate plans")
    if data.plan not in PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")

    sub = get_or_create_subscription(db)
    today = datetime.now().date()
    paid_until = today + timedelta(days=30 * data.months)

    sub.plan = data.plan
    sub.status = "active"
    sub.paid_until = str(paid_until)
    sub.max_users = PLANS[data.plan]["max_users"]
    sub.max_branches = PLANS[data.plan]["max_branches"]
    if data.business_name:
        sub.business_name = data.business_name
    if data.contact_email:
        sub.contact_email = data.contact_email
    if data.contact_phone:
        sub.contact_phone = data.contact_phone

    db.commit()
    return {"message": f"Plan activated: {data.plan} until {paid_until}", "paid_until": str(paid_until)}

@router.post("/extend-trial")
def extend_trial(days: int = 7, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Superadmin only — extend trial for a client"""
    if current_user.role != "superadmin":
        raise HTTPException(status_code=403, detail="Superadmin only")
    sub = get_or_create_subscription(db)
    if sub.trial_end:
        old_end = datetime.strptime(sub.trial_end, "%Y-%m-%d").date()
        new_end = old_end + timedelta(days=days)
    else:
        new_end = datetime.now().date() + timedelta(days=days)
    sub.trial_end = str(new_end)
    sub.status = "active"
    sub.plan = "trial"
    db.commit()
    return {"message": f"Trial extended to {new_end}"}
