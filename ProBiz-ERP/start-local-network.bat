@echo off
echo ====================================================
echo  ProBiz ERP - Local Network Mode (Multi-Branch)
echo ====================================================
echo.

:: Get local IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP: =%

echo Your local IP address: %IP%
echo.
echo Other computers on your network can access:
echo   App:  http://%IP%:3000
echo   API:  http://%IP%:8000
echo.
echo Starting backend...
start "ProBiz Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

timeout /t 4 /nobreak >nul

echo Starting frontend...
set REACT_APP_API_URL=http://%IP%:8000
start "ProBiz Frontend" cmd /k "cd /d %~dp0frontend && set REACT_APP_API_URL=http://%IP%:8000 && npm start"

echo.
echo Both servers starting...
echo Share this address with all branches: http://%IP%:3000
echo.
pause
