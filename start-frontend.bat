@echo off
echo ====================================
echo  ProBiz ERP - Starting Frontend
echo ====================================
cd /d "%~dp0frontend"

echo Installing Node packages...
call npm install

echo.
echo Pointing the app at your LOCAL backend (http://localhost:8000)
set "REACT_APP_API_URL=http://localhost:8000"

echo Starting the app on http://localhost:3000
echo (Start the backend first with start-backend.bat)
echo.
call npm run dev -- --port 3000
pause
