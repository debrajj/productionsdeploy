# Environment Configuration Guide

This guide explains how to configure environment variables for both development and production environments.

## Overview

All localhost hardcoding has been removed from the codebase. The application now uses environment variables for all URLs and configurations.

## Environment Files

### Backend (.env)
Located at: `backend/.env`

### Frontend (.env)
Located at: `frontend/.env`

## Environment Variables

### Backend Environment Variables

```bash
# Database Configuration
DATABASE_URI=mongodb+srv://your-connection-string
PAYLOAD_SECRET=your-secret-key-here

# Server Configuration
PORT=3000
NODE_ENV=development|production

# URL Configuration
FRONTEND_URL=http://localhost:8080              # Development
ADMIN_URL=http://localhost:3000/admin           # Development
BACKEND_URL=http://localhost:3000               # Development

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:8080,http://127.0.0.1:3000,http://127.0.0.1:8080
```

### Frontend Environment Variables

```bash
# API Configuration
VITE_API_ENDPOINT=http://localhost:3000/api     # Development
VITE_SERVER_BASE=http://localhost:3000          # Development
```

## Production Configuration

### Backend Production (.env)

```bash
# Database Configuration
DATABASE_URI=mongodb+srv://your-production-connection-string
PAYLOAD_SECRET=your-production-secret-key

# Server Configuration
PORT=3000
NODE_ENV=production

# Production URLs - Update these with your actual domain/IP
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://yourdomain.com/admin
BACKEND_URL=https://yourdomain.com

# Production CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend Production (.env)

```bash
# Production API Configuration
VITE_API_ENDPOINT=https://yourdomain.com/api
VITE_SERVER_BASE=https://yourdomain.com
```

## Files Updated

The following files have been updated to use environment variables instead of hardcoded localhost:

### Backend Scripts
- `backend/upload-products-final.js` - Uses `BACKEND_URL`
- `backend/add-brands.js` - Uses `BACKEND_URL`
- `backend/import-from-json.js` - Uses `BACKEND_URL`
- `backend/upload-products.js` - Uses `BACKEND_URL`
- `api-test.js` - Uses `BACKEND_URL` and `FRONTEND_URL`

### Frontend Files
- `frontend/src/config/api.ts` - Uses `VITE_API_ENDPOINT` and `VITE_SERVER_BASE`
- `frontend/src/lib/functions.ts` - Uses `VITE_API_ENDPOINT`
- `frontend/src/services/orderService.ts` - Uses `VITE_API_ENDPOINT`
- `frontend/src/services/chatbotService.ts` - Uses `VITE_API_ENDPOINT`
- `frontend/src/pages/Checkout.tsx` - Uses `VITE_API_ENDPOINT`

### Backend Configuration
- `backend/src/payload.config.ts` - Uses environment variables for database and CORS
- `backend/src/app/(frontend)/page.tsx` - Uses `FRONTEND_URL`

## Deployment Steps

### For Development
1. Use the existing `.env` files with localhost URLs
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`

### For Production
1. Update environment variables in both `.env` files
2. Replace all localhost URLs with your production domain/IP
3. Build frontend: `cd frontend && npm run build`
4. Start backend in production mode: `cd backend && npm start`
5. Serve frontend build files

## Testing Configuration

To test if all environment variables are working:

```bash
# Test backend APIs
node api-test.js

# Test with custom backend URL
BACKEND_URL=https://yourdomain.com node api-test.js
```

## Environment Variable Fallbacks

All files include fallback values for development:
- If environment variables are not set, localhost URLs are used
- This ensures the application works in development without configuration
- Production deployments MUST set proper environment variables

## Security Notes

1. Never commit production secrets to version control
2. Use different secrets for development and production
3. Ensure CORS_ORIGINS only includes trusted domains in production
4. Use HTTPS in production for all URLs