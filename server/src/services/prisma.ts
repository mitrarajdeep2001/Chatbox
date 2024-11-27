import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export default prisma;
