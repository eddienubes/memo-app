import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { IRequestWithUser } from './interfaces/request-with-user.interface';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { CleanupInterceptor } from '../common/interceptors/cleanup.interceptor';
import { UserService } from '../user/services/user.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
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
    const accessCookie = this.authService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshCookie, token: refreshToken } = this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    response.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
    return user;
  }

  @HttpCode(200)
  @UseInterceptors(CleanupInterceptor)
  @UseGuards(JwtAccessGuard)
  @Post('signout')
  signOut(@Req() req: IRequestWithUser, @Res({ passthrough: true }) res: Response): void {
    res.setHeader('Set-Cookie', this.authService.getCookieForSignOut());
    return;
  }

  @UseGuards(JwtAccessGuard)
  @Get()
  authenticate(@Req() req: IRequestWithUser) {
    const { user } = req;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() req: IRequestWithUser, @Res({ passthrough: true }) res: Response): User {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(req.user.id);

    res.setHeader('Set-Cookie', accessTokenCookie);
    return req.user;
  }
}
