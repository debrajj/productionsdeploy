# VPS Deployment Guide

## Quick Setup

### Backend (Port 3000)
1. Update `backend/.env`:
```
FRONTEND_URL=http://YOUR_VPS_IP:8080
ADMIN_URL=http://YOUR_VPS_IP:3000/admin
BACKEND_URL=http://YOUR_VPS_IP:3000
CORS_ORIGINS=http://YOUR_VPS_IP:8080,http://YOUR_VPS_IP:3000
```

### Frontend (Port 8080)
1. Update `frontend/.env`:
```
VITE_API_ENDPOINT=http://YOUR_VPS_IP:3000/api
VITE_SERVER_BASE=http://YOUR_VPS_IP:3000
```

## URLs After Deployment
- Frontend: http://YOUR_VPS_IP:8080
- Backend API: http://YOUR_VPS_IP:3000/api
- Admin Panel: http://YOUR_VPS_IP:3000/admin

## Start Commands
```bash
# Backend
cd backend && npm start

# Frontend  
cd frontend && npm run build && npm run preview --port 8080
```