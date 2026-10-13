import { PrismaClient } from '@prisma/client';

// One client for the whole process — each PrismaClient opens its own pool.
const prisma = new PrismaClient();

export default prisma;
