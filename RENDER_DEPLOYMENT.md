# 🚀 Render.com Deployment Guide for Amjad Zetouneh Food Blog

## Prerequisites

- GitHub repository: https://github.com/Ahmedtarekmekled/Amjadzetouneh.git
- MongoDB Atlas account (for database)
- Cloudinary account (for image uploads)
- Render.com account

## Step 1: Set Up MongoDB Atlas

1. Go to [https://mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Add database name: `food-blog`

## Step 2: Set Up Cloudinary

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Get your credentials from the dashboard:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Deploy Backend to Render

### 3.1 Create Backend Service

1. Go to [https://render.com/dashboard](https://render.com/dashboard)
2. Click "New" → "Web Service"
3. Connect your GitHub repository: `Ahmedtarekmekled/Amjadzetouneh`
4. Configure the service:

**Basic Settings:**

- **Name**: `amjadzetouneh-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `food-blog-backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Advanced Settings:**

- **Auto-Deploy**: Yes
- **Health Check Path**: `/api/health`

### 3.2 Add Environment Variables

Click "Environment" tab and add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-blog?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
PORT=10000
```

### 3.3 Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://amjadzetouneh-backend.onrender.com`)

## Step 4: Deploy Frontend to Render

### 4.1 Create Frontend Service

1. In Render dashboard, click "New" → "Static Site"
2. Connect your GitHub repository: `Ahmedtarekmekled/Amjadzetouneh`
3. Configure the service:

**Basic Settings:**

- **Name**: `amjadzetouneh-frontend`
- **Environment**: `Static Site`
- **Region**: Same as backend
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `out`

### 4.2 Add Environment Variables

Click "Environment" tab and add:

```
NEXT_PUBLIC_API_URL=https://amjadzetouneh-backend.onrender.com/api
```

### 4.3 Deploy Frontend

1. Click "Create Static Site"
2. Wait for deployment to complete
3. Copy your frontend URL (e.g., `https://amjadzetouneh-frontend.onrender.com`)

## Step 5: Update Backend CORS Settings

After both services are deployed, update your backend CORS to allow your frontend domain:

1. Go to your backend service in Render
2. Add this environment variable:

```
CORS_ORIGIN=https://amjadzetouneh-frontend.onrender.com
```

3. Redeploy the backend service

## Step 6: Test Your Deployment

### Test Backend:

- Visit: `https://amjadzetouneh-backend.onrender.com/api/health`
- Should return: `{"status":"ok"}`

### Test Frontend:

- Visit: `https://amjadzetouneh-frontend.onrender.com`
- Test all features:
  - ✅ Homepage loads
  - ✅ Blog posts display
  - ✅ Login functionality
  - ✅ Dashboard access
  - ✅ Create/edit posts

## Step 7: Set Up Custom Domain (Optional)

### For Frontend:

1. Go to your frontend service settings
2. Click "Custom Domains"
3. Add your domain (e.g., `amjadzetouneh.com`)
4. Configure DNS records as instructed

### For Backend:

1. Go to your backend service settings
2. Click "Custom Domains"
3. Add your API domain (e.g., `api.amjadzetouneh.com`)

## Step 8: Environment Variables Reference

### Backend Environment Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-blog?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://amjadzetouneh-frontend.onrender.com
```

### Frontend Environment Variables:

```
NEXT_PUBLIC_API_URL=https://amjadzetouneh-backend.onrender.com/api
```

## Troubleshooting

### Common Issues:

1. **Build Errors**:

   - Check Render build logs
   - Ensure all dependencies are in `package.json`
   - Verify environment variables are set correctly

2. **API Connection Issues**:

   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check CORS settings in backend
   - Test API endpoints directly

3. **Database Issues**:

   - Verify MongoDB Atlas connection string
   - Check IP whitelist (set to `0.0.0.0/0` for Render)
   - Ensure database exists

4. **Image Upload Issues**:

   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper folder permissions

5. **Frontend Not Loading**:
   - Check if static export is working
   - Verify `out` directory is being generated
   - Check for JavaScript errors in browser console

### Render-Specific Issues:

1. **Cold Start Delays**:

   - Free tier services sleep after 15 minutes of inactivity
   - First request after sleep may take 30-60 seconds
   - Consider upgrading to paid plan for always-on service

2. **Build Timeouts**:

   - Free tier has 10-minute build timeout
   - Optimize build process if needed
   - Consider upgrading for longer build times

3. **Memory Limits**:
   - Free tier has 512MB RAM limit
   - Monitor memory usage in Render dashboard
   - Optimize if approaching limits

## Monitoring and Maintenance

### Render Dashboard Features:

- **Logs**: View real-time application logs
- **Metrics**: Monitor CPU, memory, and response times
- **Deployments**: Track deployment history
- **Health Checks**: Monitor service health

### Recommended Monitoring:

1. Set up health check alerts
2. Monitor error rates
3. Track response times
4. Set up uptime monitoring

## Cost Optimization

### Free Tier Limits:

- **Backend**: 750 hours/month (sleeps after 15 min inactivity)
- **Frontend**: 100GB bandwidth/month
- **Build Time**: 10 minutes max
- **Memory**: 512MB RAM

### Upgrade Considerations:

- **Always-on backend**: $7/month
- **More bandwidth**: $10/100GB
- **Custom domains**: Free
- **SSL certificates**: Free

## Support

If you encounter issues:

1. Check Render build logs and application logs
2. Verify all environment variables are set correctly
3. Test API endpoints directly
4. Check the main README.md for additional setup instructions
5. Contact Render support if needed

---

**Your food blog will be live at**: `https://amjadzetouneh-frontend.onrender.com`
**Your API will be available at**: `https://amjadzetouneh-backend.onrender.com`

🎉 **Congratulations! Your Amjad Zetouneh Food Blog is now deployed on Render!**
