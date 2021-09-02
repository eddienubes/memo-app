import { Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { authConfig } from '../config/auth-config';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../../user/services/user.service';
import { Request } from 'express';
import { ITokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {

  constructor(
    @Inject(authConfig.KEY)
    private readonly configService: ConfigType<typeof authConfig>,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
        return req?.cookies?.Refresh;
      }]),
      secretOrKey: configService.jwtRefreshTokenSecret,
      passReqToCallback: true
    });
  }

  public async validate(request: Request, payload: ITokenPayload) {
    const refreshToken = request?.cookies?.Refresh;
    return this.userService.findUserIfRefreshTokenMatches(refreshToken, payload.userId);
  }
}