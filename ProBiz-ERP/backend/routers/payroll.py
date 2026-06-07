from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from auth import get_current_user
import models
from datetime import datetime

router = APIRouter(prefix="/api/payroll", tags=["payroll"])

class EmployeeCreate(BaseModel):
    name: str
    employee_id: str
    email: Optional[str] = None
    phone: Optional[str] = None
    cnic: Optional[str] = None
    department_id: Optional[int] = None
    branch_id: Optional[int] = None
    designation: Optional[str] = None
    join_date: Optional[str] = None
    basic_salary: float = 0.0
    allowances: float = 0.0
    deductions: float = 0.0

class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None

class AttendanceCreate(BaseModel):
    employee_id: int
    date: str
    status: str = "present"
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    notes: Optional[str] = None

class PayslipCreate(BaseModel):
    employee_id: int
    month: int
    year: int
    overtime: float = 0.0
    extra_deductions: float = 0.0

@router.get("/departments")
def get_departments(db: Session = Depends(get_db), _=Depends(get_current_user)):
    depts = db.query(models.Department).all()
    return [{"id": d.id, "name": d.name, "description": d.description, "employee_count": len(d.employees)} for d in depts]

@router.post("/departments")
def create_department(data: DepartmentCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    dept = models.Department(**data.model_dump())
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return {"id": dept.id, "name": dept.name}

@router.get("/employees")
def get_employees(search: Optional[str] = Query(None), db: Session = Depends(get_db), _=Depends(get_current_user)):
    q = db.query(models.Employee).filter(models.Employee.is_active == True)
    if search:
        q = q.filter(models.Employee.name.ilike(f"%{search}%"))
    employees = q.all()
    return [{
        "id": e.id, "name": e.name, "employee_id": e.employee_id,
        "phone": e.phone, "designation": e.designation,
        "department": e.department.name if e.department else None,
        "basic_salary": e.basic_salary, "allowances": e.allowances,
    } for e in employees]

@router.post("/employees")
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    join_date = None
    if data.join_date:
        try:
            join_date = datetime.fromisoformat(data.join_date)
        except:
            pass
    emp_data = data.model_dump()
    emp_data["join_date"] = join_date
    emp = models.Employee(**emp_data)
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return {"id": emp.id, "name": emp.name}

@router.put("/employees/{emp_id}")
def update_employee(emp_id: int, data: EmployeeCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.model_dump().items():
        if k == "join_date" and v:
            try:
                v = datetime.fromisoformat(v)
            except:
                v = None
        setattr(emp, k, v)
    db.commit()
    return {"message": "Updated"}

@router.get("/attendance")
def get_attendance(
    employee_id: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db), _=Depends(get_current_user)
):
    q = db.query(models.Attendance)
    if employee_id:
        q = q.filter(models.Attendance.employee_id == employee_id)
    if month and year:
        q = q.filter(
            models.Attendance.date >= datetime(year, month, 1),
            models.Attendance.date < datetime(year, month + 1 if month < 12 else 1, 1)
        )
    records = q.order_by(models.Attendance.date.desc()).all()
    return [{
        "id": a.id,
        "employee": a.employee.name if a.employee else "",
        "employee_id": a.employee_id,
        "date": a.date.isoformat() if a.date else None,
        "status": a.status,
        "check_in": a.check_in.isoformat() if a.check_in else None,
        "check_out": a.check_out.isoformat() if a.check_out else None,
    } for a in records]

@router.post("/attendance")
def mark_attendance(data: AttendanceCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    att = models.Attendance(
        employee_id=data.employee_id,
        date=datetime.fromisoformat(data.date),
        status=data.status,
        check_in=datetime.fromisoformat(data.check_in) if data.check_in else None,
        check_out=datetime.fromisoformat(data.check_out) if data.check_out else None,
        notes=data.notes,
    )
    db.add(att)
    db.commit()
    return {"message": "Attendance marked"}

@router.get("/payslips")
def get_payslips(employee_id: Optional[int] = Query(None), db: Session = Depends(get_db), _=Depends(get_current_user)):
    q = db.query(models.Payslip)
    if employee_id:
        q = q.filter(models.Payslip.employee_id == employee_id)
    payslips = q.order_by(models.Payslip.year.desc(), models.Payslip.month.desc()).all()
    return [{
        "id": p.id,
        "employee": p.employee.name if p.employee else "",
        "employee_id": p.employee_id,
        "month": p.month, "year": p.year,
        "basic_salary": p.basic_salary, "allowances": p.allowances,
        "overtime": p.overtime, "deductions": p.deductions,
        "tax": p.tax, "net_salary": p.net_salary, "status": p.status,
    } for p in payslips]

@router.post("/payslips/generate")
def generate_payslip(data: PayslipCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    emp = db.query(models.Employee).filter(models.Employee.id == data.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    existing = db.query(models.Payslip).filter(
        models.Payslip.employee_id == data.employee_id,
        models.Payslip.month == data.month,
        models.Payslip.year == data.year
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Payslip already generated for this month")
    gross = emp.basic_salary + emp.allowances + data.overtime
    total_deductions = emp.deductions + data.extra_deductions
    tax = gross * 0.05 if gross > 50000 else 0
    net = gross - total_deductions - tax
    payslip = models.Payslip(
        employee_id=data.employee_id,
        month=data.month,
        year=data.year,
        basic_salary=emp.basic_salary,
        allowances=emp.allowances,
        overtime=data.overtime,
        deductions=total_deductions,
        tax=tax,
        net_salary=net,
        status="pending",
    )
    db.add(payslip)
    db.commit()
    db.refresh(payslip)
    return {"id": payslip.id, "net_salary": net}

@router.put("/payslips/{payslip_id}/pay")
def pay_payslip(payslip_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(models.Payslip).filter(models.Payslip.id == payslip_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Not found")
    p.status = "paid"
    p.paid_date = datetime.utcnow()
    db.commit()
    return {"message": "Payslip marked as paid"}
