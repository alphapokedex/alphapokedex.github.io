#!/bin/bash

# Setup script for trivia_base project
# Ensures Node.js 20+ is used

echo "🔧 Setting up trivia_base project with Node.js 20+..."

# Load nvm if available
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    \. "$NVM_DIR/nvm.sh"
    NVM_AVAILABLE=true
else
    NVM_AVAILABLE=false
    echo "⚠️  nvm not found. Make sure to use Node.js 20+ manually."
fi

# Use Node.js version from .nvmrc if nvm is available
if [ "$NVM_AVAILABLE" = true ]; then
    echo "📦 Switching to Node.js version from .nvmrc..."
    nvm use
else
    echo "📦 Checking current Node.js version..."
fi

# Verify Node version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ is required. Current version: $(node --version)"
    if [ "$NVM_AVAILABLE" = true ]; then
        echo "   Please install Node.js 20+ using: nvm install 20"
    else
        echo "   Please install Node.js 20+ from https://nodejs.org/"
    fi
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🎉 Setup complete! You can now run:"
echo "   npm run dev    # Start development server"
echo "   npm run build  # Build for production"
