import {
  Controller,
  Post,
  UseGuards,
  Res,
  Req,
  Header,
  HttpCode,
  Body,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { Response } from 'express';
import { IRequestWithUser } from '../interfaces/request-with-user.interface';
import { TwoFactorAuthCodeDto } from '../dtos/two-factor-auth-code.dto';
import { UserService } from '../../user/services/user.service';
import { AuthService } from '../services/auth.service';
import { CleanupInterceptor } from '../../common/interceptors/cleanup.interceptor';
import { JwtTwoFactorGuard } from '../guards/jwt-two-factor-guard.service';

@Controller('2fa')
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('generate')
  @HttpCode(200)
  @UseGuards(JwtTwoFactorGuard)
  @Header('content-type', 'image/png')
  public async generate(@Res() res: Response, @Req() req: IRequestWithUser) {
    const { otpAuthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(req.user);

    return this.twoFactorAuthService.pipeQrCodeStream(res, otpAuthUrl);
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtTwoFactorGuard)
  public async turnOnTwoFactorAuth(
    @Req() req: IRequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthService.validateTwoFactorAuthCode(
      twoFactorAuthCode,
      req.user,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException(`Wrong authentication code`);
    }

    await this.userService.turnOnTwoFactorAuth(req.user.id);
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(CleanupInterceptor)
  public async authenticate(
    @Req() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthService.validateTwoFactorAuthCode(
      twoFactorAuthCode,
      req.user,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException(`Two factor auth code is invalid`);
    }

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      req.user.id,
      true,
    );

    res.setHeader('Set-Cookie', [accessTokenCookie]);

    return req.user;
  }
}
