#!/bin/bash

# Quick Update Script
set -e

VPS_HOST="your-vps-ip"
VPS_USER="root"
PROJECT_NAME="productionsdeploy"

echo "🔄 Updating deployment..."

# Build locally
cd frontend && npm run build && cd ..
cd backend && npm run build && cd ..

# Create update package
tar -czf update.tar.gz frontend/dist backend/.next

# Upload and update
scp update.tar.gz $VPS_USER@$VPS_HOST:/tmp/
ssh $VPS_USER@$VPS_HOST "
  cd /var/www/$PROJECT_NAME
  tar -xzf /tmp/update.tar.gz
  pm2 restart $PROJECT_NAME-backend
  rm /tmp/update.tar.gz
"

rm update.tar.gz
echo "✅ Update completed!"