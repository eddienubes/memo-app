import {
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe,
  Post,
  Req,
  Res, StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IRequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { Express } from 'express';
import { PublicFile } from '../file/entities/public-file.entity';
import { ParseFilePipe } from '../file/pipes/parse-file.pipe';
import { IPrivateFileWithUrlRO } from '../file/interfaces/private-file.ro.interface';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @Post('avatar')
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  public async addAvatar(@Req() req: IRequestWithUser, @UploadedFile(new ParseFilePipe('image', 5)) file: Express.Multer.File) {
    return this.userService.addAvatar({ buffer: file.buffer, filename: file.originalname }, req.user.id);
  }

  @Delete('avatar')
  @UseGuards(JwtAccessGuard)
  public async removeAvatar(@Req() req: IRequestWithUser): Promise<PublicFile> {
    return this.userService.removeAvatar(req.user.id);
  }

  @Post('file')
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FileInterceptor('file'))
  public async addPrivateFile(@Req() req: IRequestWithUser, @UploadedFile(new ParseFilePipe('image', 5)) file: Express.Multer.File) {
    return this.userService.addPrivateFile({
      filename: file.originalname,
      buffer: file.buffer
    }, req.user.id);
  }

  @Get('file/:id')
  @UseGuards(JwtAccessGuard)
  public async getPrivateFile(
    @Req() req: IRequestWithUser,
    @Param('id', ParseIntPipe) fileId: number
  ) {
    const file = await this.userService.getPrivateFile(fileId, req.user.id);
    return new StreamableFile(file.stream);
  }

  @Get('file')
  @UseGuards(JwtAccessGuard)
  public async getPrivateFiles(
    @Req() req: IRequestWithUser
  ): Promise<IPrivateFileWithUrlRO[]> {
    return this.userService.getAllPrivateFiles(req.user.id);
  }
}
