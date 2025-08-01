#!/bin/bash

echo "🚀 Starting combined build for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

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

# Create frontend directory in backend public
echo "📁 Setting up frontend in backend public..."
mkdir -p food-blog-backend/public/frontend

# Copy frontend build to backend public
echo "📁 Copying frontend build to backend..."
cp -r frontend/out/* food-blog-backend/public/frontend/

echo "✅ Build completed successfully!" 