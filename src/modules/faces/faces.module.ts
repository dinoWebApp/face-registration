import { Module } from '@nestjs/common';
import { FacesService } from './faces.service';
import { FaceRepository } from './repositories/face.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FacesService, FaceRepository],
  exports: [FacesService],
})
export class FacesModule {}
