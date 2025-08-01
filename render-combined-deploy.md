# 🚀 Combined Render Deployment - Frontend + Backend Together

## Overview
This guide shows you how to deploy both your frontend and backend together from the root directory, eliminating the need for separate deployments.

## Option 1: Single Web Service (Recommended)

### Step 1: Create Combined Web Service

1. Go to [https://render.com/dashboard](https://render.com/dashboard)
2. Click "New" → "Web Service"
3. Connect your GitHub repository: `Ahmedtarekmekled/Amjadzetouneh`

### Step 2: Configure the Service

**Basic Settings:**
- **Name**: `amjadzetouneh-combined`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `/` (root of repository)
- **Build Command**: `npm run install:all && npm run build`
- **Start Command**: `npm start`

**Advanced Settings:**
- **Auto-Deploy**: Yes
- **Health Check Path**: `/api/health`

### Step 3: Add Environment Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-blog?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
PORT=10000
NEXT_PUBLIC_API_URL=https://your-service-name.onrender.com/api
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Your app will be available at: `https://your-service-name.onrender.com`

## Option 2: Docker Deployment (Alternative)

### Step 1: Create Dockerfile in Root

Create a `Dockerfile` in your root directory:

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY food-blog-backend/package*.json ./food-blog-backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm run install:all

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build both applications
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=builder /app/food-blog-backend/dist ./food-blog-backend/dist
COPY --from=builder /app/frontend/out ./frontend/out
COPY --from=builder /app/food-blog-backend/package*.json ./food-blog-backend/
COPY --from=builder /app/frontend/package*.json ./frontend/

# Install only production dependencies
RUN cd food-blog-backend && npm ci --only=production
RUN cd frontend && npm ci --only=production

# Copy static files
COPY --from=builder /app/food-blog-backend/public ./food-blog-backend/public

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 10000

# Start the application
CMD ["npm", "start"]
```

### Step 2: Create .dockerignore

Create `.dockerignore` in root:

```
node_modules
.next
.git
.env
.env.local
README.md
```

### Step 3: Deploy with Docker

1. Go to Render dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `amjadzetouneh-docker`
   - **Environment**: `Docker`
   - **Root Directory**: `/`
   - **Dockerfile Path**: `Dockerfile`
   - **Docker Command**: Leave empty (uses CMD from Dockerfile)

## Option 3: Custom Build Script (Most Flexible)

### Step 1: Create Build Script

Create `render-build.sh` in root:

```bash
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

# Copy frontend build to backend public
echo "📁 Copying frontend build to backend..."
cp -r frontend/out/* food-blog-backend/public/frontend/

echo "✅ Build completed successfully!"
```

### Step 2: Update package.json Scripts

Update your root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "build": "bash render-build.sh",
    "start": "cd food-blog-backend && npm start",
    "install:all": "npm install && cd food-blog-backend && npm install && cd ../frontend && npm install",
    "dev:backend": "cd food-blog-backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev"
  }
}
```

### Step 3: Update Backend to Serve Frontend

Update `food-blog-backend/src/app.ts`:

```typescript
// Serve frontend static files
app.use(express.static(path.join(process.cwd(), 'public/frontend')));

// Serve backend API
app.use("/api", apiRoutes);

// Serve frontend for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/frontend/index.html'));
});
```

### Step 4: Deploy

1. Go to Render dashboard
2. Click "New" → "Web Service"
3. Configure:
   - **Name**: `amjadzetouneh-combined`
   - **Root Directory**: `/`
   - **Build Command**: `chmod +x render-build.sh && npm run build`
   - **Start Command**: `npm start`

## Environment Variables for Combined Deployment

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-blog?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
PORT=10000
NEXT_PUBLIC_API_URL=https://your-service-name.onrender.com/api
```

## Benefits of Combined Deployment

✅ **Single URL**: Everything accessible from one domain
✅ **Simplified Management**: One service to monitor
✅ **Cost Effective**: Only one service to pay for
✅ **Easier CORS**: No cross-origin issues
✅ **Unified Logs**: All logs in one place
✅ **Simplified SSL**: One certificate for everything

## Testing Your Combined Deployment

1. **Backend API**: `https://your-service-name.onrender.com/api/health`
2. **Frontend**: `https://your-service-name.onrender.com`
3. **Dashboard**: `https://your-service-name.onrender.com/dashboard`

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check if all dependencies are in package.json
   - Verify build scripts are correct
   - Check Render build logs

2. **Frontend Not Loading**:
   - Verify static files are copied correctly
   - Check if Next.js export is working
   - Ensure proper file paths

3. **API Not Working**:
   - Check if backend is starting correctly
   - Verify environment variables
   - Check API routes are properly configured

## Recommended Approach

**Use Option 1 (Single Web Service)** for the simplest setup:
- Easiest to configure
- Works with your existing code structure
- Minimal changes required
- Single deployment process

Your food blog will be live at: `https://your-service-name.onrender.com` 