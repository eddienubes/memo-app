import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import { authConfig } from '../config/auth-config';
import { UserService } from '../../user/services/user.service';
import { Request } from 'express';
import { ITokenPayload } from '../interfaces/token-payload.interface';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly configService: ConfigType<typeof authConfig>,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authentication;
      }]),
      secretOrKey: configService.jwtAccessTokenSecret
    });
  }

  // gets invoked after JWT access has been decoded
  async validate(payload: ITokenPayload): Promise<User> {
    return this.userService.findById(payload.userId);
  }
}