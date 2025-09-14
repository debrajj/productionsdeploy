# VPS Deployment Guide

## Quick Setup

1. **Configure deployment:**
   ```bash
   # Edit deploy/config.env with your VPS details
   VPS_HOST=your-vps-ip
   DOMAIN=yourdomain.com
   ```

2. **Deploy to VPS:**
   ```bash
   chmod +x deploy/scripts/*.sh
   ./deploy/scripts/deploy.sh
   ```

3. **Update deployment:**
   ```bash
   ./deploy/scripts/update.sh
   ```

## What gets deployed:
- Frontend: Static files served by Nginx
- Backend: Node.js app managed by PM2
- SSL: Automatic HTTPS with Let's Encrypt
- Reverse proxy: Nginx handles routing

## Requirements:
- Ubuntu/Debian VPS
- SSH access
- Domain pointing to VPS IP