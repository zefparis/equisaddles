# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git python3 make g++

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy source code with explicit checks
COPY . .

# Debug: Print directory structure and file contents
RUN echo "=== Current directory structure ===" && \
    ls -la /app && \
    echo "\n=== Server directory contents ===" && \
    find /app/server -type f -name "*.ts" | sort && \
    echo "\n=== Shared directory contents ===" && \
    find /app/shared -type f -name "*.ts" | sort && \
    echo "\n=== tsconfig.server.json contents ===" && \
    cat /app/tsconfig.server.json && \
    echo "\n=== package.json scripts ===" && \
    grep -A 10 "scripts" /app/package.json

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy built files and necessary assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Set environment to production
ENV NODE_ENV=production \
    PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the application directly with node to avoid npm issues
CMD ["node", "dist/server/index.js"]
