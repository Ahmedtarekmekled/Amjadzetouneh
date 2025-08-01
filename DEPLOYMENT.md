# 🚀 Quick Deployment Guide

This guide will help you deploy your Food Blog application quickly and easily.

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or cloud)
- Cloudinary account
- Git repository

## 🎯 Quick Start (5 minutes)

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd food-blog
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Configure Environment

Create the required environment files:

**Backend** (`food-blog-backend/.env`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-blog
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Deploy

```bash
# Option A: Using the deployment script
./deploy.sh deploy

# Option B: Manual deployment
npm run build
npm start
```

## 🌐 Production Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/.next`
4. Add environment variables in Vercel dashboard

#### Backend (Railway)

1. Connect your GitHub repo to Railway
2. Set build command: `cd food-blog-backend && npm run build`
3. Set start command: `cd food-blog-backend && npm start`
4. Add environment variables

### Option 2: Docker (All-in-one)

```bash
# Build and start all services
docker-compose up -d --build

# Access your application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Nginx: http://localhost:80
```

### Option 3: Traditional VPS

```bash
# Install PM2 globally
npm install -g pm2

# Deploy using the script
./deploy.sh deploy

# Or manually
npm run build
pm2 start ecosystem.config.js
```

## 🔧 Environment Variables Reference

### Backend Variables

| Variable                | Description               | Example                               |
| ----------------------- | ------------------------- | ------------------------------------- |
| `PORT`                  | Server port               | `5000`                                |
| `MONGODB_URI`           | MongoDB connection string | `mongodb://localhost:27017/food-blog` |
| `JWT_SECRET`            | JWT signing secret        | `your_super_secret_key`               |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name     | `your_cloud_name`                     |
| `CLOUDINARY_API_KEY`    | Cloudinary API key        | `123456789012345`                     |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret     | `your_api_secret`                     |
| `NODE_ENV`              | Environment mode          | `production`                          |

### Frontend Variables

| Variable                               | Description              | Example                        |
| -------------------------------------- | ------------------------ | ------------------------------ |
| `NEXT_PUBLIC_API_URL`                  | Backend API URL          | `https://your-backend.com/api` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`    | Cloudinary cloud name    | `your_cloud_name`              |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset | `your_preset`                  |

## 🛠️ Available Commands

### Root Level Commands

```bash
npm run dev              # Start both apps in development
npm run build            # Build both applications
npm run start            # Start both apps in production
npm run install:all      # Install all dependencies
npm run clean            # Clean build artifacts
```

### Deployment Script Commands

```bash
./deploy.sh install      # Install dependencies
./deploy.sh build        # Build applications
./deploy.sh start        # Start with PM2
./deploy.sh docker       # Start with Docker
./deploy.sh deploy       # Full deployment
./deploy.sh stop         # Stop applications
./deploy.sh restart      # Restart applications
./deploy.sh logs         # Show logs
./deploy.sh status       # Show status
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   # Check what's using the port
   lsof -i :5000
   lsof -i :3000

   # Kill the process
   kill -9 <PID>
   ```

2. **MongoDB connection failed**

   - Check if MongoDB is running
   - Verify connection string
   - Check network connectivity

3. **Build fails**

   ```bash
   # Clean and rebuild
   npm run clean
   npm run install:all
   npm run build
   ```

4. **Environment variables not loading**
   - Ensure `.env` files are in correct locations
   - Check file permissions
   - Restart the application

### Logs and Monitoring

```bash
# View PM2 logs
pm2 logs

# View specific app logs
pm2 logs food-blog-backend
pm2 logs food-blog-frontend

# Monitor resources
pm2 monit
```

## 📞 Support

If you encounter issues:

1. Check the logs: `./deploy.sh logs`
2. Verify environment variables
3. Check the [Issues](../../issues) page
4. Create a new issue with detailed information

## 🎉 Success!

Once deployed, your Food Blog will be available at:

- **Frontend**: http://localhost:3000 (or your domain)
- **Backend API**: http://localhost:5000/api (or your backend domain)

Happy blogging! 🍽️📝
