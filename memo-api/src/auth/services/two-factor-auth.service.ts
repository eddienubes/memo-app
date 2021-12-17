import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { googleAuthConfig } from '../../common/config/google-auth-config';
import { ConfigType } from '@nestjs/config';
import { User } from '../../user/entities/user.entity';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(googleAuthConfig.KEY)
    private readonly googleConfigService: ConfigType<typeof googleAuthConfig>,
  ) {}

  public async generateTwoFactorAuthSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(
      user.email,
      this.googleConfigService.googleTwoFactorAuthAppName,
      secret,
    );

    await this.userService.setTwoFactorAuthSecret(secret, user.id);

    return {
      secret,
      otpAuthUrl,
    };
  }

  public async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  public validateTwoFactorAuthCode(twoFactorAuthCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthCode,
      secret: user.twoFactorAuthSecret,
    });
  }
}
