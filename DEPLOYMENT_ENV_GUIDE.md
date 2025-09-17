# 🚀 Environment Variables Deployment Guide

## ✅ All localhost URLs have been replaced with environment variables!

### 📋 Required Environment Variables

#### Backend (.env)
```bash
# Database (Required in production)
DATABASE_URI=mongodb+srv://your-connection-string

# Security (Required)
PAYLOAD_SECRET=your-super-secret-key-here
PORT=3000
NODE_ENV=production

# URLs (Required in production)
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://yourdomain.com/admin
BACKEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### Frontend (.env)
```bash
# API Endpoints (Required in production)
VITE_API_ENDPOINT=https://yourdomain.com/api
VITE_SERVER_BASE=https://yourdomain.com
VITE_FRONTEND_URL=https://yourdomain.com
```

### 🔧 For VPS/IP-based Deployment
If using IP instead of domain:

#### Backend
```bash
FRONTEND_URL=http://YOUR_VPS_IP:8080
ADMIN_URL=http://YOUR_VPS_IP:3000/admin
BACKEND_URL=http://YOUR_VPS_IP:3000
CORS_ORIGINS=http://YOUR_VPS_IP:3000,http://YOUR_VPS_IP:8080
```

#### Frontend
```bash
VITE_API_ENDPOINT=http://YOUR_VPS_IP:3000/api
VITE_SERVER_BASE=http://YOUR_VPS_IP:3000
VITE_FRONTEND_URL=http://YOUR_VPS_IP:8080
```

### 🛡️ Security Features Added

1. **Production Environment Checks**: All files now check if environment variables are set in production
2. **No Localhost Fallbacks**: Prevents accidental localhost usage in production
3. **Clear Error Messages**: Shows exactly which environment variable is missing

### 📝 Deployment Steps

1. **Update Environment Files**:
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your production values
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **For Utility Scripts** (add-brands.js, etc.):
   ```bash
   BACKEND_URL=https://yourdomain.com node add-brands.js
   ```

3. **Build and Deploy**:
   ```bash
   # Frontend
   npm run build
   
   # Backend
   npm run build
   npm start
   ```

### ⚠️ Important Notes

- **Development**: Localhost URLs still work in development mode
- **Production**: Environment variables are mandatory
- **Scripts**: All utility scripts now require BACKEND_URL to be set
- **Testing**: Use `BACKEND_URL=https://yourdomain.com node test-api-connection.js`

### 🎯 Quick Test
```bash
# Test if environment variables are working
BACKEND_URL=https://yourdomain.com node backend/test-api-connection.js
```

Your website is now fully configured for deployment! 🎉