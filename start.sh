#!/bin/bash

# Portfolio Application Startup Script
# This script sets up and runs the full-stack portfolio application

set -e  # Exit on error

echo "🚀 Starting Portfolio Application Setup..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Node.js
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js found: $(node --version)"

# Install client dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing client dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✓${NC} Client dependencies already installed"
fi

# Install server dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo -e "${BLUE}📦 Installing server dependencies...${NC}"
    cd server
    npm install
    cd ..
else
    echo -e "${GREEN}✓${NC} Server dependencies already installed"
fi

# Setup Prisma database
echo -e "${BLUE}🗄️  Setting up database with Prisma...${NC}"
cd server
npx prisma generate
npx prisma migrate deploy 2>/dev/null || echo -e "${YELLOW}⚠️  No migrations to deploy${NC}"
cd ..

# Kill any processes running on ports 3000 and 5000
echo -e "${BLUE}🔍 Checking for processes on ports 3000 and 5000...${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

# Start the server in the background
echo -e "${BLUE}🖥️  Starting backend server on port 5000...${NC}"
cd server
node index.js &
SERVER_PID=$!
cd ..

# Wait a moment for server to start
sleep 2

# Start the React app in the background
echo -e "${BLUE}⚛️  Starting React app on port 3000...${NC}"
npm start &
CLIENT_PID=$!

# Wait for React app to be ready
echo -e "${YELLOW}⏳ Waiting for application to start...${NC}"
sleep 5

echo -e "${GREEN}✅ Application is running!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend:  ${GREEN}http://localhost:5000${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down services...${NC}"
    kill $SERVER_PID 2>/dev/null || true
    kill $CLIENT_PID 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5000 | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✅ Services stopped${NC}"
    exit 0
}

# Set up trap to cleanup on Ctrl+C
trap cleanup INT TERM

# Wait for user to stop
wait
