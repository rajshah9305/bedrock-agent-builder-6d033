#!/bin/bash

# AWS Bedrock Integration Setup Script
# This script helps you set up AWS Bedrock integration

echo "🚀 AWS Bedrock Agent Builder - Setup Script"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo -e "${RED}Error: .env.example not found${NC}"
    exit 1
fi

# Create .env if it doesn't exist
if [ -f ".env" ]; then
    echo -e "${YELLOW}Warning: .env already exists${NC}"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled"
        exit 0
    fi
fi

echo "Creating .env file..."
cp .env.example .env

# Create api directory structure
echo "Creating API directory structure..."
mkdir -p api/agents

# Check if AWS SDK is installed
if ! grep -q "@aws-sdk/client-bedrock-agent" package.json; then
    echo ""
    echo -e "${YELLOW}AWS SDK not found in package.json${NC}"
    read -p "Would you like to install it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v pnpm &> /dev/null; then
            echo "Installing with pnpm..."
            pnpm add @aws-sdk/client-bedrock-agent
        else
            echo "Installing with npm..."
            npm install @aws-sdk/client-bedrock-agent
        fi
    fi
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📝 Next Steps:"
echo "1. Edit .env file with your configuration"
echo "2. Copy API files from the artifacts to api/ directory"
echo "3. Copy src/services/api.js to your project"
echo "4. Update AgentBuilder.jsx with the new version"
echo "5. For production, add environment variables in Vercel:"
echo "   - AWS_ACCESS_KEY_ID"
echo "   - AWS_SECRET_ACCESS_KEY"
echo "   - AWS_REGION"
echo "   - VITE_API_BASE_URL"
echo ""
echo "📖 Read AWS_SETUP.md for detailed instructions"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Never commit AWS credentials to Git!${NC}"
echo ""
