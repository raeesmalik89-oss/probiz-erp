@echo off
echo ====================================
echo  ProBiz ERP - Starting Backend
echo ====================================
cd /d "%~dp0backend"

echo Checking Python...
python --version

echo Installing dependencies...
pip install -r requirements.txt

echo Seeding database with demo data...
python seed.py

echo.
echo Starting FastAPI backend on http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
