// Centralized environment configuration
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = {
  BACKEND_URL: process.env.BACKEND_URL,
  DATABASE_URI: process.env.DATABASE_URI,
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

export const ENV_CONFIG = {
  BACKEND_URL: process.env.BACKEND_URL,
  API_URL: `${process.env.BACKEND_URL}/api`,
  DATABASE_URI: process.env.DATABASE_URI,
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL,
  ADMIN_URL: process.env.ADMIN_URL,
  CORS_ORIGINS: process.env.CORS_ORIGINS
};