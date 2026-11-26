@echo off
echo ====================================
echo  ProBiz ERP - Starting Backend
echo ====================================
cd /d "%~dp0backend"

echo Checking Python...
python --version

if not exist ".env" (
  echo Creating .env with a secure SECRET_KEY...
  python -c "import secrets; open('.env','w').write('DATABASE_URL=sqlite:///./probiz_erp.db\nSECRET_KEY='+secrets.token_hex(32)+'\nALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173\nAPP_NAME=MediCloud\nAPP_VERSION=2.0.0\nDEBUG=false\n')"
)

echo Installing dependencies...
call pip install -r requirements.txt

echo Seeding database with demo data (first run only)...
python seed.py

echo.
echo Starting FastAPI backend on http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
