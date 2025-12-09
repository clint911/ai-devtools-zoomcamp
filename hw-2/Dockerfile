# Simplified Dockerfile for Coolify deployment
# Coolify's Traefik proxy handles routing - no nginx needed

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine

WORKDIR /app

# Copy built backend
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package*.json ./

# Copy built frontend (backend will serve it)
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose backend port
EXPOSE 3000

# Start backend server
CMD ["node", "dist/main.js"]
