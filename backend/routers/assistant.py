"""AI assistant — answers natural-language questions about the business from a
live data snapshot, powered by Claude (Anthropic).

Optional feature: needs ANTHROPIC_API_KEY. Without it (or without the `anthropic`
package) the endpoint degrades gracefully and tells the user how to enable it.
The model only ever sees the compact snapshot we build here — no raw DB/SQL
access — so answers stay grounded and safe.
"""
import os
from datetime import datetime, date, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
import models

router = APIRouter(prefix="/api/assistant", tags=["assistant"])

# Default to the current flagship; override with ANTHROPIC_MODEL. For this simple
# data-grounded Q&A, claude-haiku-5-5 is much cheaper/faster and works well.
MODEL = os.getenv("ANTHROPIC_MODEL", "claude-opus-5-5")


class AskIn(BaseModel):
    question: str
    history: List[dict] = []  # optional prior turns: [{"role","content"}]


def _parse_date(value):
    if not value:
        return None
    s = str(value).strip()[:10]
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    return None


def _snapshot(db: Session) -> str:
    """Build a compact, readable business snapshot for the model."""
    today = date.today()
    month_start = today.replace(day=1)

    def _sum(q):
        return float(q.scalar() or 0)

    today_sales = _sum(db.query(func.coalesce(func.sum(models.Sale.total), 0)).filter(
        func.date(models.Sale.created_at) == today, models.Sale.status == "completed"))
    month_sales = _sum(db.query(func.coalesce(func.sum(models.Sale.total), 0)).filter(
        models.Sale.created_at >= month_start, models.Sale.status == "completed"))
    month_purchases = _sum(db.query(func.coalesce(func.sum(models.Purchase.total), 0)).filter(
        models.Purchase.created_at >= month_start))
    receivables = _sum(db.query(func.coalesce(func.sum(models.Customer.balance), 0)))
    payables = _sum(db.query(func.coalesce(func.sum(models.Supplier.balance), 0)))

    n_products = db.query(models.Product).filter(models.Product.is_active == True).count()
    n_customers = db.query(models.Customer).filter(models.Customer.is_active == True).count()
    n_suppliers = db.query(models.Supplier).filter(models.Supplier.is_active == True).count()
    n_employees = db.query(models.Employee).filter(models.Employee.is_active == True).count()

    low_stock = db.query(models.Product).filter(
        models.Product.is_active == True,
        models.Product.stock <= models.Product.min_stock,
    ).limit(20).all()

    # near-expiry (within 90 days), computed from string expiry dates
    cutoff = today + timedelta(days=90)
    expiring = []
    for p in db.query(models.Product).filter(
        models.Product.is_active == True,
        models.Product.expiry_date.isnot(None),
        models.Product.expiry_date != "",
        models.Product.stock > 0,
    ).all():
        exp = _parse_date(p.expiry_date)
        if exp and exp <= cutoff:
            expiring.append((p, (exp - today).days))
    expiring.sort(key=lambda x: x[1])
    expiring = expiring[:20]

    top = db.query(
        models.Product.name, func.sum(models.SaleItem.total).label("rev")
    ).join(models.SaleItem, models.Product.id == models.SaleItem.product_id)\
     .group_by(models.Product.id).order_by(func.sum(models.SaleItem.total).desc()).limit(5).all()

    lines = [
        f"DATE: {today.isoformat()}  (currency: PKR, Rs.)",
        "FINANCIALS:",
        f"  Today's sales: Rs. {today_sales:,.0f}",
        f"  This month's sales: Rs. {month_sales:,.0f}",
        f"  This month's purchases: Rs. {month_purchases:,.0f}",
        f"  Receivables (owed by customers): Rs. {receivables:,.0f}",
        f"  Payables (owed to suppliers): Rs. {payables:,.0f}",
        f"COUNTS: products={n_products}, customers={n_customers}, suppliers={n_suppliers}, employees={n_employees}",
    ]
    lines.append(f"LOW STOCK ({len(low_stock)}):")
    lines += [f"  - {p.name}: {p.stock:g} {p.unit} (min {p.min_stock:g})" for p in low_stock] or ["  (none)"]
    lines.append(f"EXPIRING WITHIN 90 DAYS ({len(expiring)}):")
    lines += [f"  - {p.name}: {d} days left ({p.expiry_date}), stock {p.stock:g} {p.unit}"
              + (" [EXPIRED]" if d < 0 else "") for p, d in expiring] or ["  (none)"]
    lines.append("TOP PRODUCTS BY REVENUE:")
    lines += [f"  - {name}: Rs. {float(rev or 0):,.0f}" for name, rev in top] or ["  (no sales yet)"]
    return "\n".join(lines)


def _system_prompt(snapshot: str) -> str:
    return (
        "You are the AI assistant inside MediCloud, a business-management and pharmacy "
        "ERP used by Pakistani businesses. Answer the user's questions about THEIR business "
        "using only the data snapshot below. Be concise and practical; use PKR (Rs.) for money. "
        "If the snapshot doesn't contain the answer, say so plainly and suggest where in the app "
        "to look — do not invent numbers. You may give simple operational suggestions (e.g. what "
        "to reorder or which stock to clear before expiry), but do not give clinical or medical "
        "advice. Keep answers short unless asked for detail.\n\n"
        "=== LIVE BUSINESS SNAPSHOT ===\n" + snapshot
    )


@router.get("/status")
def status(_=Depends(get_current_user)):
    return {"enabled": bool(os.getenv("ANTHROPIC_API_KEY")), "model": MODEL}


@router.post("/ask")
def ask(data: AskIn, db: Session = Depends(get_db), _=Depends(get_current_user)):
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return {"configured": False, "answer": (
            "The AI assistant isn't set up yet. Add an ANTHROPIC_API_KEY to the backend "
            "environment (Render → Environment) and redeploy to enable it.")}

    question = (data.question or "").strip()
    if not question:
        return {"configured": True, "answer": "Please type a question."}

    try:
        from anthropic import Anthropic
    except ImportError:
        return {"configured": False, "answer": "The AI library isn't installed on the server."}

    system = _system_prompt(_snapshot(db))
    messages = []
    for turn in (data.history or [])[-8:]:
        role = turn.get("role")
        content = turn.get("content")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": str(content)})
    messages.append({"role": "user", "content": question})

    try:
        client = Anthropic(api_key=api_key)
        resp = client.messages.create(
            model=MODEL, max_tokens=1024, system=system, messages=messages,
        )
    except Exception as exc:  # network / auth / rate limit
        return {"configured": True, "error": True,
                "answer": f"The AI request failed ({exc.__class__.__name__}). Please try again."}

    if getattr(resp, "stop_reason", None) == "refusal":
        return {"configured": True, "answer": "I can't help with that particular request."}

    text = "".join(getattr(b, "text", "") for b in resp.content
                    if getattr(b, "type", None) == "text").strip()
    return {"configured": True, "answer": text or "(No answer was returned.)"}
