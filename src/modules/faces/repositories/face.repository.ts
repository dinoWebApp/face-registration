import { IRepository } from 'src/common/interfaces/repository.interface';
import { FaceEntity } from '../entities/face.entity';
import { Prisma } from 'generated/prisma';
import { PrismaClientType } from 'src/common/types/prisma';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  NotFoundException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PRISMA_ERR_CODE } from 'src/common/enums/prisma-error-code.enum';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class FaceRepository
  implements
    IRepository<FaceEntity, Prisma.faceCreateInput, Prisma.faceUpdateInput>
{
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    data: Prisma.faceCreateInput,
    prisma?: PrismaClientType,
  ): Promise<FaceEntity> {
    const client = prisma || this.prismaService;
    try {
      const face: FaceEntity = await client.face.create({ data });
      return face;
    } catch (error) {
      this.errorHandler(error);
    }
  }
  findById(id: number, prisma?: PrismaClientType): Promise<FaceEntity> {
    throw new Error('Method not implemented.');
  }
  update(
    id: number,
    data: Prisma.faceUpdateInput,
    prisma?: PrismaClientType,
  ): Promise<FaceEntity> {
    throw new Error('Method not implemented.');
  }
  delete(id: number, prisma?: PrismaClientType): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async findAll(prisma?: PrismaClientType): Promise<FaceEntity[]> {
    const client = prisma || this.prismaService;
    const faces: FaceEntity[] = await client.face.findMany();
    return faces;
  }

  private errorHandler(error): never {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERR_CODE.NOT_FOUND) {
        throw new NotFoundException('안면 정보를 찾을 수 없습니다.');
      }
      if (error.code === PRISMA_ERR_CODE.DUPLICATE) {
        const duplicatedField: string =
          this.prismaService.getDuplicatedField(error);
        if (duplicatedField === 'name') {
          throw new ConflictException('동일한 이름이 존재합니다.');
        }
        throw error;
      }
      throw error;
    }
    throw error;
  }
}
