@echo off
echo 🚀 Starting static build for Render...

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install:all

REM Build backend
echo 🔧 Building backend...
cd food-blog-backend
call npm run build
cd ..

REM Build frontend with static export
echo 🎨 Building frontend (static export)...
cd frontend
call npm run build
cd ..

REM Create frontend directory in backend public
echo 📁 Setting up frontend in backend public...
if not exist "food-blog-backend\public\frontend" mkdir "food-blog-backend\public\frontend"

REM Copy frontend build to backend public
echo 📁 Copying frontend build to backend...
if exist "frontend\out" (
    xcopy "frontend\out\*" "food-blog-backend\public\frontend\" /E /I /Y
    echo ✅ Frontend files copied successfully!
) else (
    echo ⚠️ Warning: frontend\out directory not found
)

echo ✅ Static build completed successfully! 