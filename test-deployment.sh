#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "====================================="
echo "Action Kanban Deployment Test Plan"
echo "====================================="

# Phase 1: Docker Check
echo -e "\n${YELLOW}Phase 1: Docker Environment Check${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"

# Phase 2: Build Backend
echo -e "\n${YELLOW}Phase 2: Building Backend Container${NC}"
docker-compose build backend
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi

# Phase 3: Start Backend Only
echo -e "\n${YELLOW}Phase 3: Starting Backend Service${NC}"
docker-compose up -d backend
sleep 5

# Test backend health
echo "Testing backend health endpoint..."
if curl -s http://localhost:13000/health > /dev/null 2>&1; then
    HEALTH=$(curl -s http://localhost:13000/health)
    echo -e "${GREEN}✅ Backend is healthy: $HEALTH${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    docker-compose logs backend
    exit 1
fi

# Phase 4: Test Backend API
echo -e "\n${YELLOW}Phase 4: Testing Backend API Endpoints${NC}"

# Test GET all items
echo "Testing GET /api/action-items..."
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:13000/api/action-items)
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ GET all items: Success${NC}"
else
    echo -e "${RED}❌ GET all items: Failed (HTTP $HTTP_STATUS)${NC}"
fi

# Test POST new item
echo "Testing POST /api/action-items..."
CREATE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:13000/api/action-items \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Action Item",
    "description": "Created by deployment test",
    "status": "todo",
    "priority": "high"
  }')
HTTP_STATUS=$(echo "$CREATE_RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
if [ "$HTTP_STATUS" = "201" ]; then
    echo -e "${GREEN}✅ POST new item: Success${NC}"
    ITEM_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "Created item ID: $ITEM_ID"
else
    echo -e "${RED}❌ POST new item: Failed (HTTP $HTTP_STATUS)${NC}"
fi

# Phase 5: Build and Start Frontend
echo -e "\n${YELLOW}Phase 5: Building Frontend Container${NC}"
docker-compose build frontend
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo "Starting frontend service..."
docker-compose up -d frontend
sleep 5

# Test frontend
echo "Testing frontend accessibility..."
if curl -s http://localhost:15173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is accessible${NC}"
else
    echo -e "${RED}❌ Frontend is not accessible${NC}"
    docker-compose logs frontend
fi

# Phase 6: Integration Test
echo -e "\n${YELLOW}Phase 6: Integration Test${NC}"
echo "Testing if frontend can reach backend through proxy..."
# This would need a more sophisticated test in a real scenario

# Phase 7: MCP Server Test
echo -e "\n${YELLOW}Phase 7: MCP Server Configuration Test${NC}"
echo "Building MCP server..."
cd mcp-server && npm run build
cd ..

echo -e "\n${GREEN}Deployment Test Summary:${NC}"
echo "- Backend API: http://localhost:13000"
echo "- Frontend UI: http://localhost:15173"
echo "- Database: SQLite (persisted in ./backend/action_items.db)"
echo ""
echo "MCP Server Configuration:"
echo "Update your claude_desktop_config.json with:"
echo '  "API_BASE_URL": "http://localhost:13000"'
echo ""
echo "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep action-kanban

echo -e "\n${YELLOW}To view logs:${NC} docker-compose logs -f"
echo -e "${YELLOW}To stop:${NC} ./stop.sh"