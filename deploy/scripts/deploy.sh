#!/bin/bash

# VPS Deployment Script
set -e

# Configuration
VPS_HOST="your-vps-ip"
VPS_USER="root"
PROJECT_NAME="productionsdeploy"
DOMAIN="yourdomain.com"

echo "🚀 Starting VPS deployment..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Build backend
echo "📦 Building backend..."
cd backend
npm install
npm run build
cd ..

# Create deployment package
echo "📋 Creating deployment package..."
tar -czf deploy.tar.gz frontend/dist backend/.next backend/package.json backend/src backend/public backend/.env.example

# Upload to VPS
echo "📤 Uploading to VPS..."
scp deploy.tar.gz $VPS_USER@$VPS_HOST:/tmp/
scp deploy/scripts/vps-setup.sh $VPS_USER@$VPS_HOST:/tmp/

# Execute deployment on VPS
echo "🔧 Setting up on VPS..."
ssh $VPS_USER@$VPS_HOST "chmod +x /tmp/vps-setup.sh && /tmp/vps-setup.sh $PROJECT_NAME $DOMAIN"

# Cleanup
rm deploy.tar.gz

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at: https://$DOMAIN"