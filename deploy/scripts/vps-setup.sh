#!/bin/bash

# VPS Server Setup Script
set -e

PROJECT_NAME=$1
DOMAIN=$2

echo "🔧 Setting up $PROJECT_NAME on VPS..."

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Create project directory
mkdir -p /var/www/$PROJECT_NAME
cd /var/www/$PROJECT_NAME

# Extract deployment files
tar -xzf /tmp/deploy.tar.gz

# Setup backend (Payload + NextJS)
cd backend
npm install --production
cp .env.example .env

# Configure PM2 for NextJS
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$PROJECT_NAME-backend',
    script: 'server.js',
    cwd: '/var/www/$PROJECT_NAME/backend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
cat > /etc/nginx/sites-available/$PROJECT_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Frontend
    location / {
        root /var/www/$PROJECT_NAME/frontend/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API & Payload Admin
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Payload Admin Panel
    location /admin {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Install SSL with Certbot
apt install -y certbot python3-certbot-nginx
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

echo "✅ VPS setup completed!"
echo "🌐 Site available at: https://$DOMAIN"