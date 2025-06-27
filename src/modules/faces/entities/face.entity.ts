import { face as PrismaFace } from 'generated/prisma';

export class FaceEntity implements PrismaFace {
  name: string;
  id: number;
  descriptor: string;
  createdAt: Date;
  updatedAt: Date;
}
