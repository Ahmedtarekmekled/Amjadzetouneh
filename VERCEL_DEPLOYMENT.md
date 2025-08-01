# 🚀 Vercel Deployment Guide for Amjad Zetouneh Food Blog

## Prerequisites

1. **GitHub Repository**: Your code is already on GitHub at [https://github.com/Ahmedtarekmekled/Amjadzetouneh.git](https://github.com/Ahmedtarekmekled/Amjadzetouneh.git)
2. **Vercel Account**: Sign up at [https://vercel.com](https://vercel.com)
3. **Backend Deployment**: Deploy backend to Railway/Render first (see DEPLOYMENT.md)

## Step 1: Deploy Backend First

Before deploying the frontend, you need to deploy your backend API:

### Option A: Railway (Recommended)
1. Go to [https://railway.app](https://railway.app)
2. Connect your GitHub account
3. Import your repository
4. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
5. Deploy and get your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render
1. Go to [https://render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `cd food-blog-backend && npm install && npm run build`
5. Set start command: `cd food-blog-backend && npm start`
6. Add environment variables as above

## Step 2: Deploy Frontend to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in with GitHub

2. **Import Repository**
   - Click "New Project"
   - Import your GitHub repository: `Ahmedtarekmekled/Amjadzetouneh`
   - Vercel will automatically detect it's a Next.js project

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Method 2: Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project: No
   - Project name: amjadzetouneh-food-blog
   - Directory: frontend
   - Override settings: Yes
   - Build command: npm run build
   - Output directory: .next
   - Development command: npm run dev

## Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `amjadzetouneh.com`)
4. Configure DNS records as instructed

## Step 4: Environment Variables

Make sure these environment variables are set in Vercel:

### Required:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

### Optional (for additional features):
```
NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.vercel.app
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
```

## Step 5: Verify Deployment

1. **Check your deployed URL** (e.g., `https://amjadzetouneh-food-blog.vercel.app`)
2. **Test the application**:
   - Homepage loads correctly
   - Blog posts display
   - Login functionality works
   - Dashboard is accessible

## Troubleshooting

### Common Issues:

1. **Build Errors**:
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **API Connection Issues**:
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check backend is running and accessible
   - Test API endpoints directly

3. **Environment Variables**:
   - Ensure all required env vars are set in Vercel
   - Check variable names match exactly

4. **CORS Issues**:
   - Add your Vercel domain to backend CORS settings
   - Update backend to allow your frontend domain

## Post-Deployment

1. **Set up automatic deployments**:
   - Every push to `main` branch will trigger a new deployment
   - Preview deployments for pull requests

2. **Monitor performance**:
   - Use Vercel Analytics
   - Check Core Web Vitals
   - Monitor API response times

3. **Set up monitoring**:
   - Configure error tracking (Sentry, etc.)
   - Set up uptime monitoring

## Support

If you encounter issues:
1. Check Vercel build logs
2. Review this deployment guide
3. Check the main README.md for additional setup instructions

---

**Your food blog will be live at**: `https://your-project-name.vercel.app` 