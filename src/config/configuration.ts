import { envT } from 'src/types/env.type';

export const envConfiguration = (): envT => ({
  NODE_ENV: process.env.NODE_ENV as string,
  PORT: Number(process.env.PORT as string),
  APPLICATION_NAME: process.env.APPLICATION_NAME as string,
  RATE_LIMITER_LIMIT: Number(process.env.RATE_LIMITER_LIMIT as string),
  RATE_LIMITER_TTL: Number(process.env.RATE_LIMITER_TTL as string),
  MONGODB_URI: process.env.MONGODB_URI as string,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME as string,
  MONGODB_USER: process.env.MONGODB_USER as string,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD as string,
  REDIS_HOST: process.env.REDIS_HOST as string,
  REDIS_PORT: Number(process.env.REDIS_PORT as string),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
  REDIS_DB_NAME: process.env.REDIS_DB_NAME as string,
  REDIS_CACHE_TTL: Number(process.env.REDIS_CACHE_TTL as string),
  EMAIL_SERVICE: process.env.EMAIL_SERVICE as string,
  EMAIL_HOST: process.env.EMAIL_HOST as string,
  EMAIL_PORT: Number(process.env.EMAIL_PORT as string),
  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
});
