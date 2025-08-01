# Food Blog - Full Stack Application

A modern food blog built with Next.js frontend and Express.js backend, featuring recipe management, user authentication, and content management.

## 🚀 Features

- **Frontend (Next.js)**

  - Modern React with TypeScript
  - Tailwind CSS for styling
  - Responsive design with RTL support
  - Image optimization with Next.js Image
  - Rich text editor for content creation
  - File upload with Cloudinary integration
  - Analytics dashboard
  - Multi-language support (English/Arabic)

- **Backend (Express.js)**
  - RESTful API with Express.js
  - MongoDB with Mongoose ODM
  - JWT authentication
  - File upload handling
  - Cloudinary integration
  - Input validation
  - CORS support

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Rich Text Editor**: TipTap
- **Image Handling**: Cloudinary, Sharp

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer with Cloudinary
- **Validation**: Express Validator
- **Image Processing**: Sharp

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB database
- Cloudinary account

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd food-blog
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Environment Setup

#### Backend Environment

Create `.env` file in `food-blog-backend/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

#### Frontend Environment

Create `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Development

```bash
# Run both frontend and backend in development mode
npm run dev

# Or run separately
npm run dev:backend  # Backend only (port 5000)
npm run dev:frontend # Frontend only (port 3000)
```

### 5. Build for Production

```bash
npm run build
```

### 6. Start Production

```bash
npm start
```

## 📁 Project Structure

```
food-blog/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   ├── types/          # TypeScript types
│   │   └── styles/         # Global styles
│   ├── public/             # Static assets
│   └── package.json
├── food-blog-backend/       # Express.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── config/         # Configuration files
│   │   └── utils/          # Utility functions
│   ├── public/             # Static files
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Upload

- `POST /api/upload` - Upload files
- `DELETE /api/upload/:filename` - Delete files

### Settings

- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

## 🚀 Deployment

### Option 1: Vercel + Railway/Render

#### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/.next`
4. Add environment variables in Vercel dashboard

#### Backend (Railway/Render)

1. Connect your GitHub repository
2. Set build command: `cd food-blog-backend && npm run build`
3. Set start command: `cd food-blog-backend && npm start`
4. Add environment variables

### Option 2: Docker Deployment

#### Create Dockerfile for Backend

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY food-blog-backend/package*.json ./
RUN npm ci --only=production
COPY food-blog-backend/ .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

#### Create Dockerfile for Frontend

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Option 3: Traditional VPS

1. **Server Setup**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install MongoDB
   sudo apt install mongodb
   ```

2. **Deploy Application**

   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd food-blog

   # Install dependencies
   npm run install:all

   # Build applications
   npm run build

   # Start with PM2
   pm2 start ecosystem.config.js
   ```

## 🔧 Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build both applications
- `npm run start` - Start both applications in production
- `npm run install:all` - Install dependencies for all packages
- `npm run clean` - Clean all build artifacts and node_modules

### Backend

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## 🔒 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-blog
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Express.js team for the backend framework
- Tailwind CSS for the utility-first CSS framework
- Cloudinary for image management
- MongoDB for the database solution
