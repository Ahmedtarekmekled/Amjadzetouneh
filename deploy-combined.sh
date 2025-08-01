#!/bin/bash

# 🚀 Combined Render Deployment Script for Amjad Zetouneh Food Blog
# This script helps you deploy both frontend and backend together

echo "🚀 Starting Combined Render Deployment for Amjad Zetouneh Food Blog"
echo "================================================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not found. Please run 'git init' first."
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Error: Git remote 'origin' not found. Please add your GitHub repository."
    exit 1
fi

echo "✅ Git repository found"
echo "📦 Pushing latest changes to GitHub..."

# Add all changes
git add .

# Commit changes
git commit -m "Prepare for combined Render deployment - $(date)"

# Push to GitHub
git push origin main

echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🎯 Next Steps for Combined Deployment:"
echo "====================================="
echo ""
echo "1. 📋 Set up external services:"
echo "   - MongoDB Atlas: https://mongodb.com/atlas"
echo "   - Cloudinary: https://cloudinary.com"
echo ""
echo "2. 🚀 Deploy to Render (Single Service):"
echo "   - Go to: https://render.com/dashboard"
echo "   - Click 'New' → 'Web Service'"
echo "   - Connect repo: Ahmedtarekmekled/Amjadzetouneh"
echo "   - Configure:"
echo "     • Name: amjadzetouneh-combined"
echo "     • Root Directory: / (root)"
echo "     • Build Command: npm run install:all && npm run build"
echo "     • Start Command: npm start"
echo "     • Health Check: /api/health"
echo ""
echo "3. ⚙️ Add Environment Variables:"
echo "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-blog?retryWrites=true&w=majority"
echo "   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random"
echo "   CLOUDINARY_CLOUD_NAME=your_cloudinary_name"
echo "   CLOUDINARY_API_KEY=your_cloudinary_api_key"
echo "   CLOUDINARY_API_SECRET=your_cloudinary_api_secret"
echo "   NODE_ENV=production"
echo "   PORT=10000"
echo "   NEXT_PUBLIC_API_URL=https://your-service-name.onrender.com/api"
echo ""
echo "4. 🎉 Deploy and Test:"
echo "   - Click 'Create Web Service'"
echo "   - Wait for deployment"
echo "   - Test: https://your-service-name.onrender.com"
echo ""
echo "📖 For detailed instructions, see: render-combined-deploy.md"
echo ""
echo "🎉 Your food blog will be live at: https://your-service-name.onrender.com"
echo "🔗 Your API will be at: https://your-service-name.onrender.com/api" 