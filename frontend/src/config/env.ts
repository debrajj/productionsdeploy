// Centralized environment configuration for frontend
const requiredEnvVars = {
  VITE_API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
  VITE_SERVER_BASE: import.meta.env.VITE_SERVER_BASE
};

// Check for missing environment variables in production
if (!import.meta.env.DEV) {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

export const ENV_CONFIG = {
  API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
  SERVER_BASE: import.meta.env.VITE_SERVER_BASE,
  IS_DEV: import.meta.env.DEV
};