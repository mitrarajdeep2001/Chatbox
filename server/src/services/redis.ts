import dotenv from "dotenv";
dotenv.config();
import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  // username: process.env.REDIS_USERNAME,
  // password: process.env.REDIS_PASSWORD,
});

export const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  // username: process.env.REDIS_USERNAME,
  // password: process.env.REDIS_PASSWORD,
});

export const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  // username: process.env.REDIS_USERNAME,
  // password: process.env.REDIS_PASSWORD,
});
