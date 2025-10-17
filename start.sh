#!/bin/bash

# AWS Bedrock Agent Builder - Startup Script

echo "🚀 Starting AWS Bedrock Agent Builder..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if pnpm is installed, if not use npm
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
else
    PACKAGE_MANAGER="npm"
    echo "📦 pnpm not found, using npm instead"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    $PACKAGE_MANAGER install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Please update .env with your AWS credentials"
fi

echo ""
echo "🔧 Configuration:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:3001"
echo "   - Package Manager: $PACKAGE_MANAGER"
echo ""

# Start both frontend and backend
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm run dev:full
else
    npm run dev:full
fi