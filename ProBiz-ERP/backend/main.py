from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth, inventory, sales, purchases, accounting, payroll, dashboard

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProBiz ERP API",
    description="Advanced Business Management System",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(inventory.router)
app.include_router(sales.router)
app.include_router(purchases.router)
app.include_router(accounting.router)
app.include_router(payroll.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "ProBiz ERP API v2.0", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}
