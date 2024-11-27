"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sub = exports.pub = exports.redis = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ioredis_1 = __importDefault(require("ioredis"));
exports.redis = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    // username: process.env.REDIS_USERNAME,
    // password: process.env.REDIS_PASSWORD,
});
exports.pub = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    // username: process.env.REDIS_USERNAME,
    // password: process.env.REDIS_PASSWORD,
});
exports.sub = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    // username: process.env.REDIS_USERNAME,
    // password: process.env.REDIS_PASSWORD,
});
