# Hostinger VPS Deployment Guide
## React+Vite Frontend + Payload+NextJS Backend

### Prerequisites
- Hostinger VPS with Ubuntu
- Domain pointed to VPS IP: `82.112.235.155`
- SSH access to VPS

---

## Step 1: Prepare Local Project

```bash
cd /Users/debrajroy/Desktop/productionsdeploy
chmod +x deploy/scripts/*.sh
```

## Step 2: Build Frontend (React+Vite)

```bash
cd frontend
npm install
npm run build
cd ..
```

## Step 3: Build Backend (Payload+NextJS)

```bash
cd backend
npm install
npm run build
cd ..
```

## Step 4: Create Deployment Package

```bash
tar -czf deploy.tar.gz frontend/dist backend/.next backend/package.json backend/src backend/public backend/.env.example backend/payload.config.ts
```

## Step 5: Upload to Hostinger VPS

```bash
scp deploy.tar.gz root@82.112.235.155:/tmp/
scp deploy/scripts/vps-setup.sh root@82.112.235.155:/tmp/
```

## Step 6: Connect to VPS

```bash
ssh root@82.112.235.155
```

## Step 7: Run Setup on VPS

```bash
chmod +x /tmp/vps-setup.sh
/tmp/vps-setup.sh productionsdeploy yourdomain.com
```

## Step 8: Configure Environment Variables

```bash
cd /var/www/productionsdeploy/backend
nano .env
```

Add your production environment variables:
```env
DATABASE_URI=your_mongodb_connection
PAYLOAD_SECRET=your_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com
```

## Step 9: Restart Services

```bash
pm2 restart productionsdeploy-backend
systemctl reload nginx
```

## Step 10: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check Nginx status
nginx -t
systemctl status nginx

# Check logs
pm2 logs productionsdeploy-backend
```

---

## Quick Update Commands

### Update Frontend Only:
```bash
cd frontend && npm run build && cd ..
tar -czf update-frontend.tar.gz frontend/dist
scp update-frontend.tar.gz root@82.112.235.155:/tmp/
ssh root@82.112.235.155 "cd /var/www/productionsdeploy && tar -xzf /tmp/update-frontend.tar.gz"
```

### Update Backend Only:
```bash
cd backend && npm run build && cd ..
tar -czf update-backend.tar.gz backend/.next
scp update-backend.tar.gz root@82.112.235.155:/tmp/
ssh root@82.112.235.155 "cd /var/www/productionsdeploy && tar -xzf /tmp/update-backend.tar.gz && pm2 restart productionsdeploy-backend"
```

### Full Update:
```bash
./deploy/scripts/update.sh
```

---

## Troubleshooting

### Check if services are running:
```bash
pm2 status
systemctl status nginx
```

### View logs:
```bash
pm2 logs productionsdeploy-backend
tail -f /var/log/nginx/error.log
```

### Restart services:
```bash
pm2 restart productionsdeploy-backend
systemctl restart nginx
```

---

## File Structure on VPS:
```
/var/www/productionsdeploy/
├── frontend/dist/          # React+Vite build
├── backend/.next/          # NextJS build
├── backend/src/            # Payload source
├── backend/package.json    # Dependencies
└── backend/.env           # Environment variables
```

## URLs:
- **Frontend**: `https://yourdomain.com`
- **Backend API**: `https://yourdomain.com/api/`
- **Payload Admin**: `https://yourdomain.com/admin`