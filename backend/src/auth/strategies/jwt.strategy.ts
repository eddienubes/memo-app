import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import { authConfig } from '../config/auth-config';
import { UserService } from '../../user/user.service';
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
      secretOrKey: configService.jwtSecret
    });
  }

  // gets invoked after JWT has been decoded
  async validate(payload: ITokenPayload): Promise<User> {
    return this.userService.getById(payload.userId);
  }
}