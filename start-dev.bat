@echo off
echo ========================================
echo  BlogSpace - Starting Development Servers
echo ========================================

echo.
echo Starting Django backend...
start cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"

timeout /t 3

echo Starting React frontend...
start cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting!
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo   Admin:    http://localhost:8000/admin
