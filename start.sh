#!/bin/bash

echo "Starting Action Kanban Application..."
echo "===================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Build and start services
echo "Building Docker images..."
docker-compose build

echo ""
echo "Starting services..."
docker-compose up -d

echo ""
echo "Waiting for services to be ready..."
sleep 5

# Check health
./check-health.sh

echo ""
echo "🚀 Application should be available at:"
echo "   - Frontend: http://localhost:15173"
echo "   - Backend API: http://localhost:13000"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"