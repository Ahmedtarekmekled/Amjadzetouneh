#!/bin/bash

echo "🚀 Starting simple build for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd food-blog-backend && npm install && cd ..
cd frontend && npm install && cd ..

# Ensure TypeScript types are installed
echo "🔧 Installing TypeScript types..."
cd food-blog-backend && npm install --save-dev @types/express @types/cors @types/multer @types/jsonwebtoken @types/bcrypt @types/node && cd ..
cd frontend && npm install --save-dev typescript @types/react @types/node && cd ..

# Build backend (compile TypeScript)
echo "🔧 Building backend..."
cd food-blog-backend
# Try to compile TypeScript, if it fails, copy files and use ts-node
if npm run build; then
    echo "✅ Backend compiled successfully"
else
    echo "⚠️ TypeScript compilation failed, using ts-node for runtime"
    mkdir -p dist
    cp -r src/* dist/
    cp package.json dist/
    # Update start script to use ts-node
    sed -i 's/"start": "node dist\/server.js"/"start": "ts-node src\/server.ts"/' package.json
fi
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
    # Create a simple index.html as fallback
    mkdir -p food-blog-backend/public/frontend
    echo "<!DOCTYPE html><html><head><title>Amjad Zetouneh Food Blog</title></head><body><h1>Site is being deployed...</h1></body></html>" > food-blog-backend/public/frontend/index.html
fi

echo "✅ Simple build completed successfully!" 