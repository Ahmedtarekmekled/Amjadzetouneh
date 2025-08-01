# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY food-blog-backend/package*.json ./food-blog-backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm run install:all

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build both applications
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=builder /app/food-blog-backend/dist ./food-blog-backend/dist
COPY --from=builder /app/food-blog-backend/public ./food-blog-backend/public
COPY --from=builder /app/food-blog-backend/package*.json ./food-blog-backend/

# Install only production dependencies for backend
RUN cd food-blog-backend && npm ci --only=production

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 10000

# Start the application
WORKDIR /app/food-blog-backend
CMD ["npm", "start"] 