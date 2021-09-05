import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { authConfig } from './config/auth-config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { GoogleAuthService } from './services/google-auth.service';
import { googleAuthConfig } from '../common/config/google-auth-config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forFeature(authConfig),
        ConfigModule.forFeature(googleAuthConfig)
      ],
      inject: [authConfig.KEY],
      useFactory: async (configService: ConfigType<typeof authConfig>) => ({
        secret: configService.jwtAccessTokenSecret,
        signOptions: {
          expiresIn: configService.jwtAccessTokenExpirationTime
        }
      })
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, GoogleAuthService],
  controllers: [AuthController]
})
export class AuthModule {
}
