# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git python3 make g++

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install runtime dependencies only
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production --ignore-scripts

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
