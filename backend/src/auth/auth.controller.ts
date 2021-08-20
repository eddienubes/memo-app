import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { IRequestWithUser } from './interfaces/request-with-user.interface';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';
import { JwtAuthenticationGuard } from './guards/jwt-authentication.guard';
import { CleanupInterceptor } from '../common/interceptors/cleanup.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @UseInterceptors(CleanupInterceptor)
  @Post('signup')
  async signUp(@Body() registrationData: RegisterDto): Promise<User> {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseInterceptors(CleanupInterceptor)
  @UseGuards(LocalAuthenticationGuard)
  @Post('signin')
  async signIn(@Req() request: IRequestWithUser, @Res({ passthrough: true }) response: Response): Promise<User> {
    const { user } = request;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    return user;
  }

  @HttpCode(200)
  @UseInterceptors(CleanupInterceptor)
  @UseGuards(JwtAuthenticationGuard)
  @Post('signout')
  signOut(@Req() req: IRequestWithUser, @Res({ passthrough: true }) res: Response): void {
    res.setHeader('Set-Cookie', this.authService.getCookieForSignOut());
    return;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() req: IRequestWithUser) {
    const { user } = req;
    return user;
  }
}
