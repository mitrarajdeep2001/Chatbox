"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
prisma
    .$connect()
    .then(() => {
    console.log("Connected to database");
})
    .catch((err) => {
    console.log("Error connecting to database", err);
})
    .finally(() => {
    prisma.$disconnect();
});
exports.default = prisma;
