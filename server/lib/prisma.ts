import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import {PrismaPg} from "@prisma/adapter-pg";

// Prisma 7 requires the PrismaPg driver adapter when using PostgreSQL
// This replaced the legacy direct connection approach in earlier versions
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

// Single shared Prisma client instance for the entire application
// Using a singleton prevents connection pool exhaustion under load
const prisma = new PrismaClient({ adapter });

export default prisma;