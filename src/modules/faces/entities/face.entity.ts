import { Face as PrismaFace } from '@prisma/client';

export class FaceEntity implements PrismaFace {
  name: string;
  id: number;
  descriptor: string;
  createdAt: Date;
  updatedAt: Date;
}
