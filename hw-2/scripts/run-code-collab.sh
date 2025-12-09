#!/bin/bash

# CODE_COLLAB - One-Click Launcher for Mac/Linux
# This script makes running CODE_COLLAB as easy as running an EXE

echo "🚀 Starting CODE_COLLAB..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running."
    echo "Please start Docker Desktop and try again."
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if image exists
if ! docker image inspect code-collab:latest > /dev/null 2>&1; then
    echo "📦 Building CODE_COLLAB (first time only)..."
    echo "This may take 2-3 minutes..."
    echo ""
    docker build -t code-collab:latest . || {
        echo "❌ Build failed. Please check the error messages above."
        read -p "Press Enter to exit..."
        exit 1
    }
    echo ""
    echo "✅ Build complete!"
    echo ""
fi

# Stop any existing container
docker stop code-collab 2>/dev/null
docker rm code-collab 2>/dev/null

# Run the container
echo "🎯 Launching CODE_COLLAB..."
docker run -d \
    --name code-collab \
    -p 80:80 \
    code-collab:latest > /dev/null

# Wait for startup
echo "⏳ Waiting for services to start..."
sleep 5

# Health check
if curl -sf http://localhost > /dev/null 2>&1; then
    echo ""
    echo "✅ CODE_COLLAB is running!"
    echo ""
    echo "🌐 Opening in your browser..."
    echo "   URL: http://localhost"
    echo ""
    echo "To stop: docker stop code-collab"
    echo ""
    
    # Open browser
    if command -v open > /dev/null; then
        open http://localhost
    elif command -v xdg-open > /dev/null; then
        xdg-open http://localhost
    fi
else
    echo "❌ Failed to start CODE_COLLAB"
    echo "Check Docker logs: docker logs code-collab"
    read -p "Press Enter to exit..."
    exit 1
fi
