#!/bin/bash

echo "Checking Action Kanban Services Health..."
echo "======================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi
echo "✅ Docker is running"

# Check if backend is healthy
echo -n "Checking backend API... "
if curl -s http://localhost:13000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
fi

# Check if frontend is accessible
echo -n "Checking frontend... "
if curl -s http://localhost:15173 > /dev/null 2>&1; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not responding"
fi

# Check Docker containers
echo ""
echo "Docker Containers Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep action-kanban || echo "No action-kanban containers running"

# Check if database exists
echo ""
echo "Database Status:"
if [ -f "./backend/action_items.db" ]; then
    echo "✅ Database file exists"
else
    echo "⚠️  Database file will be created on first run"
fi