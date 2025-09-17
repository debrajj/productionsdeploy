# Development Setup Guide

## Quick Start

### 1. Start Backend (Port 3000)
```bash
cd backend
npm install
npm run dev
```

### 2. Start Frontend (Port 8080)
```bash
cd frontend
npm install
npm run dev
```

### 3. Test API Connection
```bash
node test-api-connection.js
```

## URLs
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000/api
- **Admin Panel**: http://localhost:3000/admin
- **Health Check**: http://localhost:3000/api/health

## Environment Configuration

### Backend (.env)
- Uses localhost:3000 for development
- CORS configured for localhost:8080
- MongoDB connection ready

### Frontend (.env)
- API endpoint: http://localhost:3000/api
- Server base: http://localhost:3000

## For Production Deployment
1. Update backend/.env with your VPS IP
2. Update frontend/.env with your VPS IP
3. Rebuild both applications

## Troubleshooting
1. Make sure ports 3000 and 8080 are available
2. Check if MongoDB connection is working
3. Verify CORS settings in backend
4. Run the test script to check API connectivity