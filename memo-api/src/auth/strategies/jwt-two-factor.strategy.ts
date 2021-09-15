import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authConfig } from '../../common/config/auth-config';
import { ConfigType } from '@nestjs/config';
import {Request} from 'express';
import { ITokenPayload } from '../interfaces/token-payload.interface';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'two-factor-jwt'
) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly configService: ConfigType<typeof authConfig>,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
        return req?.cookies?.Authentication;
      }]),
      secretOrKey: configService.jwtAccessTokenSecret
    });
  }

  async validate(payload: ITokenPayload) {
    const user = await this.userService.findById(payload.userId);

    if (!user.isTwoFactorAuthEnabled) {
      return user;
    }

    if (payload.isTwoFactorAuthEnabled) {
      return user;
    }
  }
}