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
    # Ensure the target directory exists
    mkdir -p food-blog-backend/public/frontend
    
    # Copy all files from frontend/out to backend public/frontend
    cp -r frontend/out/* food-blog-backend/public/frontend/
    echo "✅ Frontend files copied successfully!"
    
    # Ensure critical files are in the right place
    echo "📁 Ensuring critical files are accessible..."
    if [ -f "frontend/out/index.html" ]; then
        cp frontend/out/index.html food-blog-backend/public/frontend/
        echo "✅ index.html copied"
    fi
    
    # Copy static assets to root level for better accessibility
    if [ -d "frontend/out/_next" ]; then
        cp -r frontend/out/_next food-blog-backend/public/
        echo "✅ _next directory copied to root"
    fi
    
    # Copy static assets from frontend/public to frontend build
    echo "📁 Copying static assets..."
    if [ -d "frontend/public" ]; then
        # Copy all static assets
        cp -r frontend/public/* food-blog-backend/public/frontend/
        echo "✅ Static assets copied from frontend/public"
        
        # Force copy specific files to ensure they exist
        echo "📁 Force copying critical assets..."
        cp -f frontend/public/favicon.ico food-blog-backend/public/frontend/
        cp -f frontend/public/manifest.json food-blog-backend/public/frontend/
        cp -rf frontend/public/images food-blog-backend/public/frontend/
        
        # Additional safety copy - ensure images directory exists
        echo "📁 Ensuring images directory exists..."
        mkdir -p food-blog-backend/public/frontend/images
        if [ -d "frontend/public/images" ]; then
            cp -rf frontend/public/images/* food-blog-backend/public/frontend/images/
            echo "✅ Images copied to backend"
        else
            echo "❌ frontend/public/images not found"
        fi
        
        # Ensure all default images exist
        echo "📁 Creating default images..."
        if [ ! -f "food-blog-backend/public/frontend/images/default-hero.jpg" ]; then
            cp food-blog-backend/public/frontend/images/hero-bg.jpg food-blog-backend/public/frontend/images/default-hero.jpg
        fi
        if [ ! -f "food-blog-backend/public/frontend/images/default-logo.png" ]; then
            cp food-blog-backend/public/frontend/images/logo.png food-blog-backend/public/frontend/images/default-logo.png
        fi
        if [ ! -f "food-blog-backend/public/frontend/images/default-favicon.png" ]; then
            cp food-blog-backend/public/frontend/favicon.ico food-blog-backend/public/frontend/images/default-favicon.png
        fi
        
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
            echo "📁 Checking for specific images:"
            ls -la food-blog-backend/public/frontend/images/ | grep -E "(logo|hero|favicon|default)"
        else
            echo "❌ images directory missing - copying directly"
            cp -r frontend/public/images food-blog-backend/public/frontend/
        fi
        
        # Final verification
        echo "📁 Final asset verification:"
        echo "Favicon exists: $([ -f "food-blog-backend/public/frontend/favicon.ico" ] && echo "✅" || echo "❌")"
        echo "Manifest exists: $([ -f "food-blog-backend/public/frontend/manifest.json" ] && echo "✅" || echo "❌")"
        echo "Images dir exists: $([ -d "food-blog-backend/public/frontend/images" ] && echo "✅" || echo "❌")"
        echo "Logo exists: $([ -f "food-blog-backend/public/frontend/images/logo.png" ] && echo "✅" || echo "❌")"
        echo "Hero bg exists: $([ -f "food-blog-backend/public/frontend/images/hero-bg.jpg" ] && echo "✅" || echo "❌")"
        echo "Default hero exists: $([ -f "food-blog-backend/public/frontend/images/default-hero.jpg" ] && echo "✅" || echo "❌")"
        
        # Run Node.js script for additional static asset copying
        echo "📁 Running Node.js static asset script..."
        node copy-static-assets.js
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

# Create admin user and sample posts
echo "🔐 Setting up admin user and sample posts..."
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
    
    // Create sample posts
    console.log('📝 Creating sample posts...');
    const Post = mongoose.model('Post', new mongoose.Schema({
      title: { en: String, ar: String },
      excerpt: { en: String, ar: String },
      content: {
        en: {
          title: String,
          content: String,
          metaTitle: String,
          metaDescription: String,
          keywords: [String]
        },
        ar: {
          title: String,
          content: String,
          metaTitle: String,
          metaDescription: String,
          keywords: [String]
        }
      },
      categories: [String],
      tags: [String],
      status: String,
      prepTime: Number,
      cookTime: Number,
      difficulty: String,
      servings: Number,
      calories: Number,
      slug: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }));

    const existingPosts = await Post.countDocuments();
    if (existingPosts === 0) {
      const samplePosts = [
        {
          title: { en: 'Delicious Homemade Pizza', ar: 'بيتزا منزلية لذيذة' },
          excerpt: { en: 'Learn how to make the perfect homemade pizza', ar: 'تعلم كيفية صنع البيتزا المثالية' },
          content: {
            en: { title: 'Delicious Homemade Pizza', content: 'This is a detailed recipe...', metaTitle: 'Pizza Recipe', metaDescription: 'Homemade pizza recipe', keywords: ['pizza', 'homemade'] },
            ar: { title: 'بيتزا منزلية لذيذة', content: 'هذه وصفة مفصلة...', metaTitle: 'وصفة البيتزا', metaDescription: 'وصفة البيتزا المنزلية', keywords: ['بيتزا', 'منزلية'] }
          },
          categories: ['main-dishes'],
          tags: ['pizza', 'italian'],
          status: 'published',
          prepTime: 30,
          cookTime: 20,
          difficulty: 'medium',
          servings: 4,
          calories: 300,
          slug: 'delicious-homemade-pizza',
          author: admin._id
        },
        {
          title: { en: 'Fresh Garden Salad', ar: 'سلطة حديقة طازجة' },
          excerpt: { en: 'A refreshing salad with fresh vegetables', ar: 'سلطة منعشة مع خضروات طازجة' },
          content: {
            en: { title: 'Fresh Garden Salad', content: 'This is a refreshing salad...', metaTitle: 'Salad Recipe', metaDescription: 'Fresh garden salad', keywords: ['salad', 'healthy'] },
            ar: { title: 'سلطة حديقة طازجة', content: 'هذه سلطة منعشة...', metaTitle: 'وصفة السلطة', metaDescription: 'سلطة حديقة طازجة', keywords: ['سلطة', 'صحية'] }
          },
          categories: ['salads'],
          tags: ['salad', 'healthy'],
          status: 'published',
          prepTime: 15,
          cookTime: 0,
          difficulty: 'easy',
          servings: 2,
          calories: 150,
          slug: 'fresh-garden-salad',
          author: admin._id
        }
      ];

      for (const postData of samplePosts) {
        await Post.create(postData);
        console.log(\`✅ Created post: \${postData.title.en}\`);
      }
      console.log('🎉 Sample posts created successfully!');
    } else {
      console.log(\`📝 Found \${existingPosts} existing posts\`);
    }
    
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