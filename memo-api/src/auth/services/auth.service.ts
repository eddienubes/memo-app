import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dtos/register.dto';
import { User } from '../../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import { authConfig } from '../../common/config/auth-config';
import { ITokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly configService: ConfigType<typeof authConfig>,
  ) {}

  public getCookieForSignOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public getCookieWithJwtAccessToken(
    userId: number,
    isTwoFactorAuthEnabled = false,
  ): string {
    const payload: ITokenPayload = { userId, isTwoFactorAuthEnabled };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.jwtAccessTokenSecret,
      expiresIn: this.configService.jwtAccessTokenExpirationTime,
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.jwtAccessTokenExpirationTime}`;
  }

  public getCookieWithJwtRefreshToken(
    userId: number,
    isTwoFactorAuthEnabled = false,
  ): {
    cookie: string;
    token: string;
  } {
    const payload: ITokenPayload = { userId, isTwoFactorAuthEnabled };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.jwtRefreshTokenSecret,
      expiresIn: this.configService.jwtRefreshTokenExpirationTime,
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/auth/refresh; Max-Age=${this.configService.jwtRefreshTokenExpirationTime}`;
    return {
      cookie,
      token,
    };
  }

  public async register(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return user;
  }

  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<User> {
    try {
      const user = await this.userService.findByEmail(email);

      await this.verifyPassword(plainTextPassword, user.password);

      return user;
    } catch (e) {
      throw new BadRequestException(`Email or password are incorrect!`);
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException(`Email or password is incorrect!`);
    }
  }
}
