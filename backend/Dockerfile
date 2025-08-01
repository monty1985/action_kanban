# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/nodemon.json ./

# Create directory for SQLite database
RUN mkdir -p /app/data

EXPOSE 3000
CMD ["node", "dist/server.js"]