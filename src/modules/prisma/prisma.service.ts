import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  getDuplicatedField(error: PrismaClientKnownRequestError): string {
    const target = error.meta && (error.meta as any).target;
    if (Array.isArray(target)) {
      if (target.length > 0) {
        return target[0];
      } else return 'unknown';
    }
    return target;
  }
}
