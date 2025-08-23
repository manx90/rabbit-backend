#!/bin/bash

# cPanel Deployment Startup Script
# This script optimizes the Node.js application for cPanel's memory constraints

echo "Starting Rabbit Backend with cPanel optimizations..."

# Set production environment
export NODE_ENV=production

# Set memory limits for cPanel
export NODE_OPTIONS="--max-old-space-size=256 --optimize-for-size"

# Disable heavy features
export DISABLE_IMAGE_OPTIMIZATION=true
export DISABLE_SWAGGER=true

# Start the application
echo "Memory limit: 256MB"
echo "Environment: Production"
echo "Starting application..."

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "Building application..."
    npm run build:prod
fi

# Start the application
npm run start:cpanel
