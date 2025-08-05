#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting final build for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd food-blog-backend && npm install && cd ..
cd frontend && npm install && cd ..

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
if [ -d "frontend/out" ]; then
    cp -r frontend/out/* food-blog-backend/public/frontend/
    echo "✅ Frontend files copied successfully!"
    
    # Copy static assets from frontend/public to frontend build
    echo "📁 Copying static assets..."
    if [ -d "frontend/public" ]; then
        # Copy all static assets
        cp -r frontend/public/* food-blog-backend/public/frontend/
        echo "✅ Static assets copied from frontend/public"
        
        # Verify specific files exist
        echo "📁 Verifying static assets..."
        if [ -f "food-blog-backend/public/frontend/favicon.ico" ]; then
            echo "✅ favicon.ico exists in build"
        else
            echo "❌ favicon.ico missing - copying directly"
            cp frontend/public/favicon.ico food-blog-backend/public/frontend/
        fi
        
        if [ -f "food-blog-backend/public/frontend/manifest.json" ]; then
            echo "✅ manifest.json exists in build"
        else
            echo "❌ manifest.json missing - copying directly"
            cp frontend/public/manifest.json food-blog-backend/public/frontend/
        fi
        
        if [ -d "food-blog-backend/public/frontend/images" ]; then
            echo "✅ images directory exists in build"
            ls -la food-blog-backend/public/frontend/images/
        else
            echo "❌ images directory missing - copying directly"
            cp -r frontend/public/images food-blog-backend/public/frontend/
        fi
    fi
    
    # Verify the index.html file exists
    if [ -f "food-blog-backend/public/frontend/index.html" ]; then
        echo "✅ index.html found in frontend build"
    else
        echo "❌ Error: index.html not found in frontend build"
        ls -la food-blog-backend/public/frontend/
        exit 1
    fi
    
    # Verify static assets exist
    echo "📁 Checking static assets..."
    if [ -f "food-blog-backend/public/frontend/favicon.ico" ]; then
        echo "✅ favicon.ico found"
    else
        echo "❌ favicon.ico not found"
    fi
    
    if [ -f "food-blog-backend/public/frontend/manifest.json" ]; then
        echo "✅ manifest.json found"
    else
        echo "❌ manifest.json not found"
    fi
    
    if [ -d "food-blog-backend/public/frontend/images" ]; then
        echo "✅ images directory found"
        ls -la food-blog-backend/public/frontend/images/
    else
        echo "❌ images directory not found"
    fi
else
    echo "❌ Error: frontend/out directory not found"
    echo "Checking frontend directory contents:"
    ls -la frontend/
    exit 1
fi

# Create uploads directory if it doesn't exist
echo "📁 Creating uploads directory..."
mkdir -p food-blog-backend/public/uploads

# Create admin user
echo "🔐 Setting up admin user..."
cd food-blog-backend
# Create admin user directly in the backend directory
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-blog');

// User Schema (simplified for this script)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminData = {
      username: 'amjad',
      email: 'amjad@gmail.com',
      password: 'admin123',
      isAdmin: true,
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email:', adminData.email);
      console.log('Password:', adminData.password);
      await mongoose.connection.close();
      return;
    }

    // Create new admin user
    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();
"
cd ..

echo "✅ Final build completed successfully! 🚀" 