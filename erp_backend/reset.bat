@echo off
echo ============================================
echo FC/CRM SYSTEM RESET SCRIPT
echo ============================================
echo.

echo [1/8] Stopping any running server...
taskkill /f /im python.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/8] Deleting old migrations and cache...
rmdir /s /q erp_api\migrations 2>nul
mkdir erp_api\migrations
echo # > erp_api\migrations\__init__.py

rmdir /s /q erp_api\__pycache__ 2>nul
rmdir /s /q erp_backend\__pycache__ 2>nul

echo [3/8] Creating database in MySQL...
mysql -u root -p -e "DROP DATABASE IF EXISTS crm_erp_system; CREATE DATABASE crm_erp_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if errorlevel 1 (
    echo Warning: Could not connect to MySQL.
    echo Please make sure MySQL is running.
)

echo [4/8] Making migrations...
python manage.py makemigrations

echo [5/8] Applying migrations...
python manage.py migrate

echo [6/8] Creating superuser (if not exists)...
python manage.py createsuperuser --username=admin --email=admin@example.com --noinput 2>nul
if errorlevel 1 (
    echo Superuser already exists or could not be created.
    echo To create manually: python manage.py createsuperuser
)

echo [7/8] Creating required directories...
mkdir templates 2>nul
mkdir static 2>nul
mkdir static\css 2>nul

echo [8/8] Collecting static files...
python manage.py collectstatic --noinput

echo.
echo ============================================
echo SETUP COMPLETE!
echo ============================================
echo.
echo Access URLs:
echo 1. Dashboard: http://localhost:8000/
echo 2. Admin Panel: http://localhost:8000/admin/
echo 3. API Dashboard: http://localhost:8000/api/dashboard/
echo.
echo Default credentials (if created):
echo Username: admin
echo Password: admin123
echo.
pause