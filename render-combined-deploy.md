# Combined Deployment Guide for Food Blog

This guide shows how to deploy your food blog as a single service on Render, combining both frontend and backend.

## Quick Start

### 1. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository: `Ahmedtarekmekled/Amjadzetouneh`
4. Configure the service:

**Basic Settings:**
- **Name**: `amjadzetouneh`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (root of repo)
- **Build Command**: `npm run install:all && npm run build`
- **Start Command**: `npm start`

### 2. Add Environment Variables

Click "Environment" tab and add:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
PORT=10000
NEXT_PUBLIC_API_URL=https://amjadzetouneh.onrender.com/api
```

### 3. Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Your app will be available at: `https://amjadzetouneh.onrender.com`

## How It Works

### Build Process

1. **Install Dependencies**: Installs packages for both frontend and backend
2. **Build Backend**: Compiles TypeScript to JavaScript
3. **Build Frontend**: Creates static export with Next.js
4. **Copy Files**: Copies frontend build to backend's public directory
5. **Start Server**: Runs the combined application

### File Structure After Build

```
food-blog-backend/
├── dist/                    # Compiled backend code
├── public/
│   ├── frontend/           # Static frontend files
│   │   ├── index.html
│   │   ├── _next/
│   │   └── ...
│   └── uploads/            # User uploaded files
└── server.js               # Entry point
```

### Request Flow

1. **Static Files**: Served directly from `public/frontend/`
2. **API Requests**: Handled by Express backend at `/api/*`
3. **File Uploads**: Stored in `public/uploads/`
4. **SPA Routing**: All non-API routes serve `index.html`

## Benefits of Combined Deployment

✅ **Single URL**: Everything accessible from one domain
✅ **Simplified Management**: One service to monitor
✅ **Cost Effective**: Only one service to pay for
✅ **Easier CORS**: No cross-origin issues
✅ **Unified Logs**: All logs in one place
✅ **Simplified SSL**: One certificate for everything

## Testing Your Combined Deployment

1. **Backend API**: `https://amjadzetouneh.onrender.com/api/health`
2. **Frontend**: `https://amjadzetouneh.onrender.com`
3. **Dashboard**: `https://amjadzetouneh.onrender.com/dashboard`

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

## Environment Variables Reference

### Required Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-blog
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NODE_ENV=production
PORT=10000
NEXT_PUBLIC_API_URL=https://amjadzetouneh.onrender.com/api
```

### Optional Variables

```
NODE_ENV=production
PORT=10000
```

## Final Result

Your food blog will be live at: `https://amjadzetouneh.onrender.com` 