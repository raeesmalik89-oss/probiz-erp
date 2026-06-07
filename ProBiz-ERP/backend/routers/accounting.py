from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional
from database import get_db
from auth import get_current_user
import models

router = APIRouter(prefix="/api/accounting", tags=["accounting"])

class AccountCreate(BaseModel):
    name: str
    account_type: str
    account_code: str
    description: Optional[str] = None

class TransactionCreate(BaseModel):
    account_id: int
    description: str
    debit: float = 0.0
    credit: float = 0.0
    reference: Optional[str] = None

@router.get("/accounts")
def get_accounts(db: Session = Depends(get_db), _=Depends(get_current_user)):
    accounts = db.query(models.Account).filter(models.Account.is_active == True).all()
    return [{
        "id": a.id, "name": a.name, "account_type": a.account_type,
        "account_code": a.account_code, "balance": a.balance,
    } for a in accounts]

@router.post("/accounts")
def create_account(data: AccountCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    acc = models.Account(**data.model_dump())
    db.add(acc)
    db.commit()
    db.refresh(acc)
    return {"id": acc.id, "name": acc.name}

@router.get("/transactions")
def get_transactions(
    account_id: Optional[int] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db), _=Depends(get_current_user)
):
    q = db.query(models.Transaction)
    if account_id:
        q = q.filter(models.Transaction.account_id == account_id)
    if from_date:
        q = q.filter(models.Transaction.transaction_date >= from_date)
    if to_date:
        q = q.filter(models.Transaction.transaction_date <= to_date)
    total = q.count()
    txns = q.order_by(models.Transaction.transaction_date.desc()).offset(skip).limit(limit).all()
    return {
        "total": total,
        "transactions": [{
            "id": t.id,
            "account": t.account.name if t.account else "",
            "account_type": t.account.account_type if t.account else "",
            "description": t.description,
            "debit": t.debit, "credit": t.credit,
            "reference": t.reference,
            "date": t.transaction_date.isoformat() if t.transaction_date else None,
        } for t in txns]
    }

@router.post("/transactions")
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    account = db.query(models.Account).filter(models.Account.id == data.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    txn = models.Transaction(**data.model_dump())
    account.balance += data.debit - data.credit
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return {"id": txn.id}

@router.get("/summary")
def get_accounting_summary(db: Session = Depends(get_db), _=Depends(get_current_user)):
    accounts = db.query(models.Account).filter(models.Account.is_active == True).all()
    summary = {"asset": 0, "liability": 0, "equity": 0, "income": 0, "expense": 0}
    for a in accounts:
        t = a.account_type.lower()
        if t in summary:
            summary[t] += a.balance
    return {
        "total_assets": summary["asset"],
        "total_liabilities": summary["liability"],
        "total_equity": summary["equity"],
        "total_income": summary["income"],
        "total_expense": summary["expense"],
        "net_profit": summary["income"] - summary["expense"],
    }
