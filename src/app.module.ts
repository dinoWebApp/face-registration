import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { FacesModule } from './modules/faces/faces.module';

@Module({
  imports: [PrismaModule, FacesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
