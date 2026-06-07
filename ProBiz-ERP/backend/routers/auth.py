from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
import models
from auth import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "cashier"
    branch_id: int | None = None

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=401, detail="Account is deactivated")
    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "branch_id": user.branch_id,
        }
    }

@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        name=request.name,
        email=request.email,
        hashed_password=get_password_hash(request.password),
        role=request.role,
        branch_id=request.branch_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User created successfully", "id": user.id}

@router.get("/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "branch_id": current_user.branch_id,
        "is_active": current_user.is_active,
    }

@router.get("/users")
def list_users(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    users = db.query(models.User).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role, "is_active": u.is_active} for u in users]
