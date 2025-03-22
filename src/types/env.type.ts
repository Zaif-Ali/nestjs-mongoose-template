export type envT = {
  NODE_ENV: string;
  PORT: number;
  APPLICATION_NAME: string;
  // Throttler Rate limiter config
  RATE_LIMITER_LIMIT: number;
  RATE_LIMITER_TTL: number;
  // MongoDB config
  MONGODB_URI: string;
  MONGODB_DB_NAME: string;
  MONGODB_USER: string;
  MONGODB_PASSWORD: string;
  // Redis config
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  REDIS_DB_NAME: string;
  REDIS_CACHE_TTL: number;
  // Email config
  EMAIL_SERVICE: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
};
