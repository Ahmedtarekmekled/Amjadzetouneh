#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting combined build for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Install dependencies without fixing vulnerabilities (to preserve TypeScript types)
echo "📦 Installing dependencies (preserving TypeScript types)..."
npm install
cd food-blog-backend && npm install && cd ..
cd frontend && npm install && cd ..

# Build backend
echo "🔧 Building backend..."
cd food-blog-backend
npm run build
cd ..

# Build frontend with static export
echo "🎨 Building frontend (static export)..."
cd frontend
npm run build
cd ..

# Create frontend directory in backend public
echo "📁 Setting up frontend in backend public..."
mkdir -p food-blog-backend/public/frontend

# Copy frontend build to backend public
echo "📁 Copying frontend build to backend..."
if [ -d "frontend/out" ]; then
    echo "✅ Found frontend/out directory"
    cp -r frontend/out/* food-blog-backend/public/frontend/
    echo "✅ Frontend files copied successfully!"
    
    # Verify the index.html file exists
    if [ -f "food-blog-backend/public/frontend/index.html" ]; then
        echo "✅ index.html found in frontend build"
    else
        echo "❌ Error: index.html not found in frontend build"
        ls -la food-blog-backend/public/frontend/
        exit 1
    fi
elif [ -d "frontend/.next" ]; then
    echo "⚠️ Using .next directory as fallback"
    cp -r frontend/.next/* food-blog-backend/public/frontend/
    echo "✅ Frontend files copied from .next!"
else
    echo "❌ Error: No frontend build output found"
    echo "Checking frontend directory contents:"
    ls -la frontend/
    exit 1
fi

# Create uploads directory if it doesn't exist
echo "📁 Creating uploads directory..."
mkdir -p food-blog-backend/public/uploads

echo "✅ Static build completed successfully!" 