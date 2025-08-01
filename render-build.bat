@echo off
echo 🚀 Starting combined build for Render...

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install:all

REM Build backend
echo 🔧 Building backend...
cd food-blog-backend
call npm run build
cd ..

REM Build frontend
echo 🎨 Building frontend...
cd frontend
call npm run build
cd ..

REM Create frontend directory in backend public
echo 📁 Setting up frontend in backend public...
if not exist "food-blog-backend\public\frontend" mkdir "food-blog-backend\public\frontend"

REM Copy frontend build to backend public
echo 📁 Copying frontend build to backend...
xcopy "frontend\out\*" "food-blog-backend\public\frontend\" /E /I /Y

echo ✅ Build completed successfully! 