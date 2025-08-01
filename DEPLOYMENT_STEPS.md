# 🚀 Complete Deployment Guide for Amjad Zetouneh Food Blog

## Prerequisites
- GitHub repository: https://github.com/Ahmedtarekmekled/Amjadzetouneh.git
- MongoDB Atlas account (for database)
- Cloudinary account (for image uploads)
- Railway account (for backend)
- Vercel account (for frontend)

## Step 1: Set Up MongoDB Atlas

1. Go to [https://mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/food-blog?retryWrites=true&w=majority`)

## Step 2: Set Up Cloudinary

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Get your credentials from the dashboard:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Deploy Backend to Railway

1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select: `Ahmedtarekmekled/Amjadzetouneh`
5. Configure the project:
   - **Root Directory**: `food-blog-backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

6. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-blog?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

7. Deploy and wait for it to complete
8. Copy your Railway URL (e.g., `https://your-app.railway.app`)

## Step 4: Deploy Frontend to Vercel

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `Ahmedtarekmekled/Amjadzetouneh`
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
   ```

6. Click "Deploy"

## Step 5: Test Your Deployment

1. **Frontend URL**: `https://your-project.vercel.app`
2. **Backend URL**: `https://your-app.railway.app`

Test the following:
- ✅ Homepage loads
- ✅ Blog posts display
- ✅ Login functionality
- ✅ Dashboard access
- ✅ Create/edit posts

## Step 6: Set Up Custom Domain (Optional)

### For Frontend (Vercel):
1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records

### For Backend (Railway):
1. Go to your Railway project
2. Click "Settings" → "Domains"
3. Add custom domain

## Troubleshooting

### Common Issues:

1. **Build Errors**:
   - Check Railway/Vercel build logs
   - Ensure all environment variables are set
   - Verify MongoDB connection string

2. **API Connection Issues**:
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check CORS settings in backend
   - Test API endpoints directly

3. **Database Issues**:
   - Verify MongoDB Atlas connection
   - Check IP whitelist in MongoDB Atlas
   - Ensure database exists

4. **Image Upload Issues**:
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper folder permissions

## Environment Variables Reference

### Backend (Railway):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-blog?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
```

## Support

If you encounter issues:
1. Check the build logs in Railway/Vercel
2. Verify all environment variables are set correctly
3. Test API endpoints directly
4. Check the main README.md for additional setup instructions

---

**Your food blog will be live at**: `https://your-project.vercel.app`
**Your API will be available at**: `https://your-app.railway.app` 