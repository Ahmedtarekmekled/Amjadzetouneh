#!/bin/bash

# 🚀 Render Deployment Script for Amjad Zetouneh Food Blog
# This script helps you deploy your food blog to Render.com

echo "🚀 Starting Render Deployment for Amjad Zetouneh Food Blog"
echo "=================================================="

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
git commit -m "Prepare for Render deployment - $(date)"

# Push to GitHub
git push origin main

echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. 📋 Set up MongoDB Atlas:"
echo "   - Go to https://mongodb.com/atlas"
echo "   - Create free account and cluster"
echo "   - Get your connection string"
echo ""
echo "2. ☁️ Set up Cloudinary:"
echo "   - Go to https://cloudinary.com"
echo "   - Create free account"
echo "   - Get your credentials"
echo ""
echo "3. 🚀 Deploy Backend to Render:"
echo "   - Go to https://render.com/dashboard"
echo "   - Click 'New' → 'Web Service'"
echo "   - Connect your GitHub repo: Ahmedtarekmekled/Amjadzetouneh"
echo "   - Root Directory: food-blog-backend"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm start"
echo ""
echo "4. 🌐 Deploy Frontend to Render:"
echo "   - Click 'New' → 'Static Site'"
echo "   - Connect your GitHub repo"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm install && npm run build"
echo "   - Publish Directory: out"
echo ""
echo "5. ⚙️ Add Environment Variables:"
echo "   See RENDER_DEPLOYMENT.md for detailed instructions"
echo ""
echo "📖 For detailed instructions, see: RENDER_DEPLOYMENT.md"
echo ""
echo "🎉 Your food blog will be live at: https://your-frontend-name.onrender.com"
echo "🔗 Your API will be at: https://your-backend-name.onrender.com" 