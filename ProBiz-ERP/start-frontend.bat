@echo off
echo ====================================
echo  ProBiz ERP - Starting Frontend
echo ====================================
cd /d "%~dp0frontend"

echo Installing Node packages...
npm install

echo.
echo Starting React app on http://localhost:3000
echo.
npm start
pause
