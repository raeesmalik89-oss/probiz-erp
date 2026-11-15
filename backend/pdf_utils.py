"""PDF generation helpers (ReportLab). Currently: sales invoice PDFs."""
from io import BytesIO
from datetime import datetime, timezone, timedelta

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer,
)

BRAND = colors.HexColor("#1e40af")
BRAND_LIGHT = colors.HexColor("#dbeafe")
MUTED = colors.HexColor("#64748b")
LINE = colors.HexColor("#e2e8f0")

# Pakistan Standard Time (UTC+5) for display.
PKT = timezone(timedelta(hours=5))


def _fmt(n):
    try:
        return f"Rs. {float(n or 0):,.0f}"
    except (TypeError, ValueError):
        return "Rs. 0"


def _local(dt):
    if not dt:
        return "-"
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(PKT).strftime("%d %b %Y, %I:%M %p")


def build_invoice_pdf(sale, items, customer, business):
    """Return PDF bytes for a sale.

    sale: models.Sale, items: list[models.SaleItem], customer: models.Customer|None,
    business: dict with name/phone/email.
    """
    buf = BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=A4,
        leftMargin=16 * mm, rightMargin=16 * mm,
        topMargin=16 * mm, bottomMargin=16 * mm,
        title=f"Invoice {sale.invoice_no}",
    )
    styles = getSampleStyleSheet()
    h_brand = ParagraphStyle("brand", parent=styles["Title"], fontSize=20, textColor=BRAND, spaceAfter=0, leading=24)
    small = ParagraphStyle("small", parent=styles["Normal"], fontSize=8, textColor=MUTED, leading=11)
    normal = ParagraphStyle("n", parent=styles["Normal"], fontSize=9, leading=12)
    right = ParagraphStyle("r", parent=styles["Normal"], fontSize=9, alignment=2, leading=12)
    inv_title = ParagraphStyle("it", parent=styles["Title"], fontSize=22, textColor=BRAND, alignment=2, leading=24)

    story = []

    # Header: brand (left) + INVOICE (right)
    contact_lines = business.get("name", "ProBiz ERP")
    sub = []
    if business.get("phone"):
        sub.append(business["phone"])
    if business.get("email"):
        sub.append(business["email"])
    header = Table([[
        [Paragraph(business.get("name", "ProBiz ERP"), h_brand),
         Paragraph(" &nbsp;|&nbsp; ".join(sub) if sub else "Business Management System", small)],
        [Paragraph("INVOICE", inv_title),
         Paragraph(sale.invoice_no, right),
         Paragraph(_local(sale.created_at), right)],
    ]], colWidths=[None, 65 * mm])
    header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEBELOW", (0, 0), (-1, 0), 2, BRAND),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
    ]))
    story += [header, Spacer(1, 10)]

    # Bill-to / payment
    cust_name = customer.name if customer else "Walk-in Customer"
    cust_phone = (customer.phone if customer and customer.phone else "")
    bill = Table([[
        [Paragraph("<b>BILL TO</b>", small), Paragraph(cust_name, normal),
         Paragraph(cust_phone, small)],
        [Paragraph("<b>PAYMENT</b>", small),
         Paragraph((sale.payment_method or "cash").replace("_", " ").title(), normal),
         Paragraph(f"Status: {(sale.status or 'completed').title()}", small)],
    ]], colWidths=[None, 70 * mm])
    bill.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story += [bill, Spacer(1, 12)]

    # Items table
    data = [["#", "Product", "Unit Price", "Qty", "Total"]]
    for i, it in enumerate(items, 1):
        pname = it.product.name if it.product else ""
        data.append([str(i), pname, _fmt(it.unit_price), f"{it.quantity:g}", _fmt(it.total)])
    tbl = Table(data, colWidths=[12 * mm, None, 28 * mm, 18 * mm, 30 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (2, 0), (-1, -1), "RIGHT"),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("ALIGN", (3, 0), (3, -1), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story += [tbl, Spacer(1, 10)]

    # Totals block (right-aligned)
    totals_rows = [["Subtotal", _fmt(sale.subtotal)]]
    if (sale.discount or 0) > 0:
        totals_rows.append(["Discount", "- " + _fmt(sale.discount)])
    if (sale.tax or 0) > 0:
        totals_rows.append(["Tax", _fmt(sale.tax)])
    totals_rows.append(["TOTAL", _fmt(sale.total)])
    totals_rows.append(["Paid", _fmt(sale.paid)])
    if (sale.balance or 0) > 0:
        totals_rows.append(["Balance Due", _fmt(sale.balance)])
    totals = Table(totals_rows, colWidths=[35 * mm, 35 * mm], hAlign="RIGHT")
    style = [
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    # highlight the TOTAL row
    total_idx = len(totals_rows) - (3 if (sale.balance or 0) > 0 else 2)
    style += [
        ("BACKGROUND", (0, total_idx), (-1, total_idx), BRAND),
        ("TEXTCOLOR", (0, total_idx), (-1, total_idx), colors.white),
        ("FONTNAME", (0, total_idx), (-1, total_idx), "Helvetica-Bold"),
    ]
    totals.setStyle(TableStyle(style))
    story += [totals, Spacer(1, 16)]

    story.append(Paragraph(
        f"Thank you for your business! &nbsp;|&nbsp; {business.get('name', 'ProBiz ERP')} &nbsp;|&nbsp; "
        "Computer-generated invoice.", small))

    doc.build(story)
    buf.seek(0)
    return buf.getvalue()
