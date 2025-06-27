import { PrismaClientType } from '../types/prisma';

export interface IRepository<Entity, CreateDto, UpdateDto> {
  create(data: CreateDto, prisma?: PrismaClientType): Promise<Entity>;
  findById(id: number, prisma?: PrismaClientType): Promise<Entity | null>;
  update(
    id: number,
    data: UpdateDto,
    prisma?: PrismaClientType,
  ): Promise<Entity>;
  delete(id: number, prisma?: PrismaClientType): Promise<void>;
  findAll(prisma?: PrismaClientType): Promise<Entity[]>;
}
