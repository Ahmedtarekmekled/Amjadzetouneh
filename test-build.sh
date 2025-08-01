#!/bin/bash

echo "🧪 Testing build process locally..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf food-blog-backend/dist
rm -rf food-blog-backend/public/frontend
rm -rf frontend/out
rm -rf frontend/.next

# Install dependencies
echo "📦 Installing dependencies..."
cd food-blog-backend && npm install && cd ..
cd frontend && npm install && cd ..

# Build backend
echo "🔧 Building backend..."
cd food-blog-backend
npm run build
cd ..

# Build frontend
echo "🎨 Building frontend..."
cd frontend
npm run build
cd ..

# Test the build output
echo "✅ Build completed! Checking output..."
if [ -d "frontend/out" ]; then
    echo "✅ Frontend out directory exists"
    ls -la frontend/out/
else
    echo "❌ Frontend out directory not found"
    exit 1
fi

if [ -d "food-blog-backend/dist" ]; then
    echo "✅ Backend dist directory exists"
    ls -la food-blog-backend/dist/
else
    echo "❌ Backend dist directory not found"
    exit 1
fi

echo "🎉 Build test completed successfully!" 