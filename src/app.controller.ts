import { Body, Controller, Get, HttpCode, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterFaceDto } from './modules/faces/dto/register-face.dto';
import { FacesService } from './modules/faces/faces.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly facesService: FacesService,
  ) {}

  @Get('register-face-page')
  @Render('registration')
  index() {}

  @Post('registration')
  @HttpCode(200)
  async registerFace(@Body() registerFaceDto: RegisterFaceDto) {
    await this.facesService.registerFace(registerFaceDto);

    return { message: 'ok' };
  }

  @Get('faces')
  @HttpCode(200)
  async getFaces() {
    return await this.facesService.getFaces();
  }
}
