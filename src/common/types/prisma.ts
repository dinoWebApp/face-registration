import { Prisma, PrismaClient } from '@prisma/client';

export type TransactionClient = Prisma.TransactionClient;
export type PrismaClientType = PrismaClient | TransactionClient;
