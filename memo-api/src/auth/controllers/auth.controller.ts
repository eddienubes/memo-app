import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LocalAuthenticationGuard } from '../guards/local-authentication.guard';
import { IRequestWithUser } from '../interfaces/request-with-user.interface';
import { Request, Response } from 'express';
import { User } from '../../user/entities/user.entity';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { CleanupInterceptor } from '../../common/interceptors/cleanup.interceptor';
import { UserService } from '../../user/services/user.service';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { TokenVerificationDto } from '../dtos/token-verification.dto';
import { GoogleAuthService } from '../services/google-auth.service';
import { JwtTwoFactorGuard } from '../guards/jwt-two-factor-guard.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly googleAuthService: GoogleAuthService,
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
  async signIn(@Req() request: IRequestWithUser, @Res({ passthrough: true }) response: Response): Promise<User | void> {
    const { user } = request;
    const accessCookie = this.authService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshCookie, token: refreshToken } = this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    response.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    if (user.isTwoFactorAuthEnabled) {
      return;
    }

    return user;
  }

  @HttpCode(200)
  @UseInterceptors(CleanupInterceptor)
  @UseGuards(JwtTwoFactorGuard)
  @Post('signout')
  signOut(@Req() req: IRequestWithUser, @Res({ passthrough: true }) res: Response): void {
    res.setHeader('Set-Cookie', this.authService.getCookieForSignOut());
    return;
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get()
  authenticate(@Req() req: IRequestWithUser) {
    const { user } = req;
    return user;
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('refresh')
  refresh(@Req() req: IRequestWithUser, @Res({ passthrough: true }) res: Response): User {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(req.user.id);

    res.setHeader('Set-Cookie', accessTokenCookie);
    return req.user;
  }

  @Post('google')
  public async authenticateWithGoogle(@Body() tokenData: TokenVerificationDto, @Res({ passthrough: true }) res: Response) {
    const {
      accessTokenCookie,
      refreshTokenCookie,
      user,
    } = await this.googleAuthService.authenticate(tokenData.token);

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    if (!user.isTwoFactorAuthEnabled) {
      return;
    }

    return user;
  }

}
