"""Server-side Excel (.xlsx) report exports via openpyxl."""
from io import BytesIO
from typing import Optional, List

from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

from database import get_db
from auth import get_current_user
import models

router = APIRouter(prefix="/api/exports", tags=["exports"])

XLSX_MEDIA = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

HEADER_FILL = PatternFill("solid", fgColor="1E40AF")
HEADER_FONT = Font(bold=True, color="FFFFFF", size=11)
TOTAL_FILL = PatternFill("solid", fgColor="DBEAFE")
TOTAL_FONT = Font(bold=True, color="1E40AF")
THIN = Side(style="thin", color="E2E8F0")
BORDER = Border(bottom=THIN)


def _build_xlsx(title: str, headers: List[str], rows: List[list],
                money_cols: Optional[set] = None, total_label_col: int = 0) -> bytes:
    money_cols = money_cols or set()
    wb = Workbook()
    ws = wb.active
    ws.title = title[:31]

    # Header row
    ws.append(headers)
    for c, _ in enumerate(headers, 1):
        cell = ws.cell(row=1, column=c)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(horizontal="right" if (c - 1) in money_cols else "left", vertical="center")
    ws.row_dimensions[1].height = 22

    # Data rows
    for r in rows:
        ws.append(r)

    # Number formatting + borders
    for row in ws.iter_rows(min_row=2, max_row=ws.max_row):
        for cell in row:
            cell.border = BORDER
            if (cell.column - 1) in money_cols:
                cell.number_format = '#,##0'
                cell.alignment = Alignment(horizontal="right")

    # Totals row for money columns
    if ws.max_row > 1 and money_cols:
        total_row = ["" for _ in headers]
        total_row[total_label_col] = "TOTAL"
        for mc in money_cols:
            col_letter = get_column_letter(mc + 1)
            total_row[mc] = f"=SUM({col_letter}2:{col_letter}{ws.max_row})"
        ws.append(total_row)
        tr = ws.max_row
        for c in range(1, len(headers) + 1):
            cell = ws.cell(row=tr, column=c)
            cell.fill = TOTAL_FILL
            cell.font = TOTAL_FONT
            if (c - 1) in money_cols:
                cell.number_format = '#,##0'
                cell.alignment = Alignment(horizontal="right")

    # Column widths
    for c, h in enumerate(headers, 1):
        width = max(len(str(h)) + 2, 12)
        for row in ws.iter_rows(min_row=2, max_row=min(ws.max_row, 200), min_col=c, max_col=c):
            for cell in row:
                if cell.value is not None:
                    width = max(width, min(len(str(cell.value)) + 2, 40))
        ws.column_dimensions[get_column_letter(c)].width = width

    ws.freeze_panes = "A2"
    buf = BytesIO()
    wb.save(buf)
    buf.seek(0)
    return buf.getvalue()


def _xlsx_response(data: bytes, filename: str) -> Response:
    return Response(
        content=data,
        media_type=XLSX_MEDIA,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/sales.xlsx")
def export_sales(from_date: Optional[str] = Query(None), to_date: Optional[str] = Query(None),
                 db: Session = Depends(get_db), _=Depends(get_current_user)):
    q = db.query(models.Sale)
    if from_date:
        q = q.filter(models.Sale.created_at >= from_date)
    if to_date:
        q = q.filter(models.Sale.created_at <= to_date)
    sales = q.order_by(models.Sale.created_at.desc()).all()
    headers = ["Invoice No", "Customer", "Date", "Payment", "Status", "Items", "Subtotal", "Discount", "Tax", "Total", "Paid", "Balance"]
    rows = [[
        s.invoice_no,
        s.customer.name if s.customer else "Walk-in",
        s.created_at.strftime("%Y-%m-%d %H:%M") if s.created_at else "",
        (s.payment_method or "").replace("_", " "),
        s.status or "",
        len(s.items),
        s.subtotal or 0, s.discount or 0, s.tax or 0, s.total or 0, s.paid or 0, s.balance or 0,
    ] for s in sales]
    data = _build_xlsx("Sales", headers, rows, money_cols={6, 7, 8, 9, 10, 11})
    return _xlsx_response(data, "sales-report.xlsx")


@router.get("/purchases.xlsx")
def export_purchases(from_date: Optional[str] = Query(None), to_date: Optional[str] = Query(None),
                     db: Session = Depends(get_db), _=Depends(get_current_user)):
    q = db.query(models.Purchase)
    if from_date:
        q = q.filter(models.Purchase.created_at >= from_date)
    if to_date:
        q = q.filter(models.Purchase.created_at <= to_date)
    purchases = q.order_by(models.Purchase.created_at.desc()).all()
    headers = ["PO Number", "Supplier", "Date", "Payment", "Status", "Subtotal", "Discount", "Tax", "Total", "Paid", "Balance"]
    rows = [[
        p.po_number,
        p.supplier.name if p.supplier else "",
        p.created_at.strftime("%Y-%m-%d %H:%M") if p.created_at else "",
        (p.payment_method or "").replace("_", " "),
        p.status or "",
        p.subtotal or 0, p.discount or 0, p.tax or 0, p.total or 0, p.paid or 0, p.balance or 0,
    ] for p in purchases]
    data = _build_xlsx("Purchases", headers, rows, money_cols={5, 6, 7, 8, 9, 10})
    return _xlsx_response(data, "purchases-report.xlsx")


@router.get("/inventory.xlsx")
def export_inventory(db: Session = Depends(get_db), _=Depends(get_current_user)):
    products = db.query(models.Product).filter(models.Product.is_active == True).all()
    headers = ["Product", "Barcode", "SKU", "Category", "Unit", "Cost Price", "Sale Price", "Stock", "Stock Value", "Min Stock", "Status"]
    rows = [[
        p.name, p.barcode or "", p.sku or "",
        p.category.name if p.category else "",
        p.unit, p.cost_price or 0, p.sale_price or 0, p.stock or 0,
        round((p.cost_price or 0) * (p.stock or 0), 2),
        p.min_stock or 0,
        "Low Stock" if (p.stock or 0) <= (p.min_stock or 0) else "In Stock",
    ] for p in products]
    data = _build_xlsx("Inventory", headers, rows, money_cols={5, 6, 7, 8, 9})
    return _xlsx_response(data, "inventory-valuation.xlsx")
