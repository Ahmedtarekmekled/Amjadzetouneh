#!/bin/bash

echo "🚀 Starting combined build for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Fix vulnerabilities
echo "🔧 Fixing vulnerabilities..."
npm audit fix --force || true
cd food-blog-backend && npm audit fix --force || true && cd ..
cd frontend && npm audit fix --force || true && cd ..

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
    cp -r frontend/out/* food-blog-backend/public/frontend/
    echo "✅ Frontend files copied successfully!"
else
    echo "⚠️ Warning: frontend/out directory not found"
fi

echo "✅ Static build completed successfully!" 