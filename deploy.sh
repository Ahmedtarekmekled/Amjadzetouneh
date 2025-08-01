#!/bin/bash

# Food Blog Deployment Script
# This script helps deploy the food blog application

set -e

echo "🚀 Starting Food Blog Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_status "npm version: $(npm -v)"

# Function to check if .env files exist
check_env_files() {
    if [ ! -f "food-blog-backend/.env" ]; then
        print_warning "Backend .env file not found. Creating from example..."
        if [ -f "food-blog-backend/.env.example" ]; then
            cp food-blog-backend/.env.example food-blog-backend/.env
            print_status "Backend .env file created. Please update with your configuration."
        else
            print_error "Backend .env.example file not found. Please create .env file manually."
            exit 1
        fi
    fi

    if [ ! -f "frontend/.env.local" ]; then
        print_warning "Frontend .env.local file not found. Creating..."
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
EOF
        print_status "Frontend .env.local file created. Please update with your configuration."
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install backend dependencies
    cd food-blog-backend
    npm install
    cd ..
    
    # Install frontend dependencies
    cd frontend
    npm install
    cd ..
    
    print_status "Dependencies installed successfully!"
}

# Function to build applications
build_applications() {
    print_status "Building applications..."
    
    # Build backend
    cd food-blog-backend
    npm run build
    cd ..
    
    # Build frontend
    cd frontend
    npm run build
    cd ..
    
    print_status "Applications built successfully!"
}

# Function to start applications with PM2
start_with_pm2() {
    print_status "Starting applications with PM2..."
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        print_status "Installing PM2..."
        npm install -g pm2
    fi
    
    # Create logs directory
    mkdir -p logs
    
    # Start applications
    pm2 start ecosystem.config.js
    
    print_status "Applications started with PM2!"
    print_status "Backend: http://localhost:5000"
    print_status "Frontend: http://localhost:3000"
    
    # Show PM2 status
    pm2 status
}

# Function to start applications with Docker
start_with_docker() {
    print_status "Starting applications with Docker..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Build and start containers
    docker-compose up -d --build
    
    print_status "Applications started with Docker!"
    print_status "Backend: http://localhost:5000"
    print_status "Frontend: http://localhost:3000"
    print_status "Nginx: http://localhost:80"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  install     Install all dependencies"
    echo "  build       Build both applications"
    echo "  start       Start applications with PM2"
    echo "  docker      Start applications with Docker"
    echo "  deploy      Full deployment (install + build + start)"
    echo "  stop        Stop all applications"
    echo "  restart     Restart all applications"
    echo "  logs        Show application logs"
    echo "  status      Show application status"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy     # Full deployment"
    echo "  $0 docker     # Start with Docker"
    echo "  $0 logs       # Show logs"
}

# Main script logic
case "${1:-help}" in
    install)
        check_env_files
        install_dependencies
        ;;
    build)
        build_applications
        ;;
    start)
        start_with_pm2
        ;;
    docker)
        start_with_docker
        ;;
    deploy)
        check_env_files
        install_dependencies
        build_applications
        start_with_pm2
        ;;
    stop)
        if command -v pm2 &> /dev/null; then
            pm2 stop all
            print_status "All applications stopped."
        else
            print_warning "PM2 not found. Applications may still be running."
        fi
        ;;
    restart)
        if command -v pm2 &> /dev/null; then
            pm2 restart all
            print_status "All applications restarted."
        else
            print_warning "PM2 not found. Please start applications manually."
        fi
        ;;
    logs)
        if command -v pm2 &> /dev/null; then
            pm2 logs
        else
            print_warning "PM2 not found. Check logs manually in the logs/ directory."
        fi
        ;;
    status)
        if command -v pm2 &> /dev/null; then
            pm2 status
        else
            print_warning "PM2 not found. Check application status manually."
        fi
        ;;
    help|*)
        show_usage
        ;;
esac

print_status "Deployment script completed!" 