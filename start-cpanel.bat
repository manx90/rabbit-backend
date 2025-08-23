@echo off
REM cPanel Deployment Startup Script for Windows
REM This script optimizes the Node.js application for cPanel's memory constraints

echo Starting Rabbit Backend with cPanel optimizations...

REM Set production environment
set NODE_ENV=production

REM Set memory limits for cPanel
set NODE_OPTIONS=--max-old-space-size=256 --optimize-for-size

REM Disable heavy features
set DISABLE_IMAGE_OPTIMIZATION=true
set DISABLE_SWAGGER=true

REM Start the application
echo Memory limit: 256MB
echo Environment: Production
echo Starting application...

REM Check if dist folder exists
if not exist "dist" (
    echo Building application...
    npm run build:prod
)

REM Start the application
npm run start:cpanel

pause
